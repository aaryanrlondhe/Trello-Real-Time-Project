#!/bin/bash

# Test script for Trello API operations
API_URL="http://localhost:5001"

echo "================================"
echo "Testing Trello API Operations"
echo "================================"

# Create a board
echo -e "\n1. Creating a board..."
BOARD_RESPONSE=$(curl -s -X POST "$API_URL/api/boards" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Board","defaultLists":true}')

BOARD_ID=$(echo $BOARD_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Board Response: $BOARD_RESPONSE"
echo "Board ID: $BOARD_ID"

# Get board and lists
echo -e "\n2. Getting board lists..."
LISTS_RESPONSE=$(curl -s -X GET "$API_URL/api/boards/$BOARD_ID/lists")
echo "Lists Response: $LISTS_RESPONSE"

# Extract first list ID
LIST_ID=$(echo $LISTS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "First List ID: $LIST_ID"

# Create a card
echo -e "\n3. Creating a card..."
CARD_RESPONSE=$(curl -s -X POST "$API_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"boardId\":\"$BOARD_ID\",\"listId\":\"$LIST_ID\",\"name\":\"Test Card\",\"desc\":\"Test Description\"}")

CARD_ID=$(echo $CARD_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Card Response: $CARD_RESPONSE"
echo "Card ID: $CARD_ID"

# Get the card
echo -e "\n4. Getting the card..."
GET_CARD=$(curl -s -X GET "$API_URL/api/tasks/$CARD_ID")
echo "Get Card Response: $GET_CARD"

# Update the card
echo -e "\n5. Updating the card..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Card","desc":"Updated Description"}')
echo "Update Response: $UPDATE_RESPONSE"

# Get lists again to get second list
echo -e "\n6. Getting all lists again..."
ALL_LISTS=$(curl -s -X GET "$API_URL/api/boards/$BOARD_ID/lists")
echo "All Lists: $ALL_LISTS"

# Extract second list ID
LIST_IDS=($(echo $ALL_LISTS | grep -o '"id":"[^"]*' | cut -d'"' -f4))
SECOND_LIST_ID=${LIST_IDS[1]}
echo "Second List ID: $SECOND_LIST_ID"

# Move the card to second list
if [ ! -z "$SECOND_LIST_ID" ] && [ "$SECOND_LIST_ID" != "$LIST_ID" ]; then
  echo -e "\n7. Moving card to second list..."
  MOVE_RESPONSE=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_ID" \
    -H "Content-Type: application/json" \
    -d "{\"idList\":\"$SECOND_LIST_ID\"}")
  echo "Move Response: $MOVE_RESPONSE"
fi

# Delete the card
echo -e "\n8. Deleting the card..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/api/tasks/$CARD_ID")
echo "Delete Response: $DELETE_RESPONSE"

# Get board to verify card is deleted
echo -e "\n9. Getting board to verify card deletion..."
FINAL_BOARD=$(curl -s -X GET "$API_URL/api/boards/$BOARD_ID/lists")
echo "Final Board Lists: $FINAL_BOARD"

echo -e "\n================================"
echo "Test Complete"
echo "================================"
