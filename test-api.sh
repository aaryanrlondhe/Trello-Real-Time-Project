#!/bin/bash

# 🧪 API Testing Script - Run these commands to test your backend

echo "🧪 TRELLO REALTIME API TEST SUITE"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5001"

echo -e "${BLUE}1. Testing Health Check${NC}"
echo "========================"
curl -s -X GET "$BASE_URL/health" | jq .
echo ""

echo -e "${BLUE}2. Creating a Board${NC}"
echo "==================="
BOARD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/boards" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Board",
    "defaultLists": true
  }')

echo "$BOARD_RESPONSE" | jq .
BOARD_ID=$(echo "$BOARD_RESPONSE" | jq -r '.data.id')
echo "Board ID: $BOARD_ID"
echo ""

echo -e "${BLUE}3. Getting Board Details${NC}"
echo "======================="
curl -s -X GET "$BASE_URL/api/boards/$BOARD_ID" | jq .
echo ""

echo -e "${BLUE}4. Getting Board Lists${NC}"
echo "===================="
LISTS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/boards/$BOARD_ID/lists")
echo "$LISTS_RESPONSE" | jq .
LIST_ID=$(echo "$LISTS_RESPONSE" | jq -r '.[0].id')
echo "List ID: $LIST_ID"
echo ""

echo -e "${BLUE}5. Creating a Card${NC}"
echo "=================="
CARD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"boardId\": \"$BOARD_ID\",
    \"listId\": \"$LIST_ID\",
    \"name\": \"Test Card\",
    \"desc\": \"This is a test card\"
  }")

echo "$CARD_RESPONSE" | jq .
CARD_ID=$(echo "$CARD_RESPONSE" | jq -r '.data.id')
echo "Card ID: $CARD_ID"
echo ""

echo -e "${BLUE}6. Updating a Card${NC}"
echo "=================="
curl -s -X PUT "$BASE_URL/api/tasks/$CARD_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Card",
    "desc": "Updated description"
  }' | jq .
echo ""

echo -e "${BLUE}7. Getting a Card${NC}"
echo "=================="
curl -s -X GET "$BASE_URL/api/tasks/$CARD_ID" | jq .
echo ""

echo -e "${BLUE}8. Listing All Cards${NC}"
echo "===================="
curl -s -X GET "$BASE_URL/api/tasks?boardId=$BOARD_ID" | jq .
echo ""

echo -e "${BLUE}9. Deleting a Card${NC}"
echo "=================="
curl -s -X DELETE "$BASE_URL/api/tasks/$CARD_ID" | jq .
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Notes:"
echo "- Backend must be running on port 5001"
echo "- Data is mock data (TEST_MODE is enabled)"
echo "- Add real Trello credentials to .env to use real Trello"
echo ""
