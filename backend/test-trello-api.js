#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config({ path: './.env' });

const API_KEY = process.env.TRELLO_API_KEY;
const API_TOKEN = process.env.TRELLO_API_TOKEN;
const BASE_URL = 'https://api.trello.com/1';

console.log('\n🔍 TRELLO API VALIDATION TEST\n');
console.log('='.repeat(50));

// Check if credentials exist
if (!API_KEY || !API_TOKEN) {
  console.error('❌ ERROR: TRELLO_API_KEY or TRELLO_API_TOKEN is missing in .env');
  process.exit(1);
}

console.log('✓ Credentials found in .env file');
console.log(`  API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(-4)}`);
console.log(`  API Token: ${API_TOKEN.substring(0, 8)}...${API_TOKEN.substring(-4)}`);

async function testTrelloAPI() {
  try {
    console.log('\n📡 Testing Trello API Connection...\n');

    // Test 1: Get current member info
    console.log('Test 1: Verifying API Credentials');
    try {
      const memberResponse = await axios.get(
        `${BASE_URL}/members/me`,
        {
          params: {
            key: API_KEY,
            token: API_TOKEN
          }
        }
      );
      
      console.log('✓ API Credentials are VALID');
      console.log(`  Username: ${memberResponse.data.username}`);
      console.log(`  Full Name: ${memberResponse.data.fullName}`);
      console.log(`  Member ID: ${memberResponse.data.id}`);
    } catch (error) {
      console.error('❌ Invalid Credentials!');
      console.error(`  Error: ${error.response?.data?.message || error.message}`);
      console.error(`  Status: ${error.response?.status}`);
      process.exit(1);
    }

    // Test 2: List boards
    console.log('\nTest 2: Fetching Your Boards');
    try {
      const boardsResponse = await axios.get(
        `${BASE_URL}/members/me/boards`,
        {
          params: {
            key: API_KEY,
            token: API_TOKEN,
            filter: 'open'
          }
        }
      );
      
      const boards = boardsResponse.data;
      if (boards.length > 0) {
        console.log(`✓ Found ${boards.length} boards:`);
        boards.slice(0, 5).forEach(board => {
          console.log(`  • ${board.name} (ID: ${board.id})`);
        });
        if (boards.length > 5) {
          console.log(`  ... and ${boards.length - 5} more`);
        }
      } else {
        console.warn('⚠️  No boards found. Create one to test further.');
      }
    } catch (error) {
      console.error('❌ Failed to fetch boards');
      console.error(`  Error: ${error.message}`);
    }

    // Test 3: Test board creation
    console.log('\nTest 3: Testing Board Creation');
    try {
      const testBoardName = `Test Board ${Date.now()}`;
      const createResponse = await axios.post(
        `${BASE_URL}/boards`,
        {},
        {
          params: {
            name: testBoardName,
            key: API_KEY,
            token: API_TOKEN
          }
        }
      );
      
      const boardId = createResponse.data.id;
      console.log('✓ Board created successfully');
      console.log(`  Board Name: ${createResponse.data.name}`);
      console.log(`  Board ID: ${boardId}`);
      console.log(`  URL: ${createResponse.data.url}`);

      // Test 4: Get board details with lists
      console.log('\nTest 4: Fetching Board Details');
      try {
        const detailsResponse = await axios.get(
          `${BASE_URL}/boards/${boardId}`,
          {
            params: {
              key: API_KEY,
              token: API_TOKEN,
              lists: 'open'
            }
          }
        );
        
        console.log('✓ Board details retrieved');
        console.log(`  ID: ${detailsResponse.data.id}`);
        console.log(`  Name: ${detailsResponse.data.name}`);
        console.log(`  Created: ${detailsResponse.data.dateLastActivity}`);
      } catch (error) {
        console.error('❌ Failed to get board details');
        console.error(`  Error: ${error.message}`);
      }

      // Test 5: Get board lists
      console.log('\nTest 5: Fetching Board Lists');
      try {
        const listsResponse = await axios.get(
          `${BASE_URL}/boards/${boardId}/lists`,
          {
            params: {
              key: API_KEY,
              token: API_TOKEN
            }
          }
        );
        
        console.log(`✓ Found ${listsResponse.data.length} lists:`);
        listsResponse.data.forEach(list => {
          console.log(`  • ${list.name} (ID: ${list.id})`);
        });

        // Test 6: Create card in first list
        if (listsResponse.data.length > 0) {
          const listId = listsResponse.data[0].id;
          console.log('\nTest 6: Creating Test Card');
          try {
            const cardResponse = await axios.post(
              `${BASE_URL}/cards`,
              {},
              {
                params: {
                  idList: listId,
                  name: `Test Card ${Date.now()}`,
                  desc: 'This is a test card created by the validation script',
                  key: API_KEY,
                  token: API_TOKEN
                }
              }
            );
            
            console.log('✓ Card created successfully');
            console.log(`  Card Name: ${cardResponse.data.name}`);
            console.log(`  Card ID: ${cardResponse.data.id}`);
            console.log(`  URL: ${cardResponse.data.url}`);
          } catch (error) {
            console.error('❌ Failed to create card');
            console.error(`  Error: ${error.message}`);
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch lists');
        console.error(`  Error: ${error.message}`);
      }

      // Cleanup: Delete test board
      console.log('\nTest 7: Cleaning Up (Deleting Test Board)');
      try {
        await axios.put(
          `${BASE_URL}/boards/${boardId}/closed`,
          {},
          {
            params: {
              value: 'true',
              key: API_KEY,
              token: API_TOKEN
            }
          }
        );
        console.log('✓ Test board closed successfully');
      } catch (error) {
        console.error('⚠️  Could not delete test board');
        console.error(`  Error: ${error.message}`);
      }
    } catch (error) {
      console.error('❌ Failed to create test board');
      console.error(`  Error: ${error.message}`);
      if (error.response?.data) {
        console.error(`  Details: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ TRELLO API VALIDATION COMPLETE\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

testTrelloAPI();
