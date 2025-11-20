#!/bin/bash

# Comprehensive test script for all Trello operations
API_URL="http://localhost:5001"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Comprehensive Trello API Test${NC}"
echo -e "${YELLOW}================================${NC}"

# Test 1: Create Board
echo -e "\n${YELLOW}1. CREATE BOARD TEST${NC}"
BOARD_RESPONSE=$(curl -s -X POST "$API_URL/api/boards" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Board","defaultLists":true}')

if echo "$BOARD_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Board creation successful${NC}"
  BOARD_ID=$(echo $BOARD_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  echo -e "  Board ID: $BOARD_ID"
else
  echo -e "${RED}✗ Board creation failed${NC}"
  echo "Response: $BOARD_RESPONSE"
  exit 1
fi

# Test 2: Get Board Lists
echo -e "\n${YELLOW}2. GET BOARD LISTS TEST${NC}"
LISTS_RESPONSE=$(curl -s -X GET "$API_URL/api/boards/$BOARD_ID/lists")

if echo "$LISTS_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Board lists retrieved successfully${NC}"
  LIST_IDS=($(echo $LISTS_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -3))
  LIST_ID_1=${LIST_IDS[0]}
  LIST_ID_2=${LIST_IDS[1]}
  LIST_ID_3=${LIST_IDS[2]}
  echo -e "  List 1: $LIST_ID_1"
  echo -e "  List 2: $LIST_ID_2"
  echo -e "  List 3: $LIST_ID_3"
else
  echo -e "${RED}✗ Board lists retrieval failed${NC}"
  exit 1
fi

# Test 3: Create Multiple Cards
echo -e "\n${YELLOW}3. CREATE MULTIPLE CARDS TEST${NC}"
CARD_IDS=()

for i in {1..3}; do
  CARD_RESPONSE=$(curl -s -X POST "$API_URL/api/tasks" \
    -H "Content-Type: application/json" \
    -d "{\"boardId\":\"$BOARD_ID\",\"listId\":\"$LIST_ID_1\",\"name\":\"Card $i\",\"desc\":\"Description for card $i\"}")
  
  if echo "$CARD_RESPONSE" | grep -q '"success":true'; then
    CARD_ID=$(echo $CARD_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    CARD_IDS+=($CARD_ID)
    echo -e "${GREEN}✓ Card $i created: $CARD_ID${NC}"
  else
    echo -e "${RED}✗ Card $i creation failed${NC}"
  fi
done

# Test 4: Update Card
echo -e "\n${YELLOW}4. UPDATE CARD TEST${NC}"
CARD_TO_UPDATE=${CARD_IDS[0]}
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_TO_UPDATE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Card 1","desc":"Updated description"}')

if echo "$UPDATE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Card updated successfully${NC}"
  echo -e "  Updated: $(echo $UPDATE_RESPONSE | grep -o '"name":"[^"]*' | head -1)"
else
  echo -e "${RED}✗ Card update failed${NC}"
fi

# Test 5: Move Card to Another List
echo -e "\n${YELLOW}5. MOVE CARD TEST${NC}"
CARD_TO_MOVE=${CARD_IDS[1]}
MOVE_RESPONSE=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_TO_MOVE" \
  -H "Content-Type: application/json" \
  -d "{\"idList\":\"$LIST_ID_2\"}")

if echo "$MOVE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Card moved successfully${NC}"
  echo -e "  Card $CARD_TO_MOVE moved to list $LIST_ID_2"
else
  echo -e "${RED}✗ Card move failed${NC}"
fi

# Test 6: Get Card Details
echo -e "\n${YELLOW}6. GET CARD DETAILS TEST${NC}"
GET_CARD_RESPONSE=$(curl -s -X GET "$API_URL/api/tasks/$CARD_TO_UPDATE")

if echo "$GET_CARD_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Card details retrieved successfully${NC}"
  echo -e "  Name: $(echo $GET_CARD_RESPONSE | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)"
else
  echo -e "${RED}✗ Get card details failed${NC}"
fi

# Test 7: Delete Card
echo -e "\n${YELLOW}7. DELETE CARD TEST${NC}"
CARD_TO_DELETE=${CARD_IDS[2]}
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/api/tasks/$CARD_TO_DELETE")

if echo "$DELETE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Card deleted successfully${NC}"
  echo -e "  Deleted: $CARD_TO_DELETE"
else
  echo -e "${RED}✗ Card deletion failed${NC}"
fi

# Test 8: Verify Card Deletion
echo -e "\n${YELLOW}8. VERIFY CARD DELETION TEST${NC}"
FINAL_LISTS=$(curl -s -X GET "$API_URL/api/boards/$BOARD_ID/lists")

# Count cards in first list
CARDS_IN_LIST_1=$(echo $FINAL_LISTS | grep -o "\"idList\":\"$LIST_ID_1\"" | wc -l)

echo -e "  Cards remaining in first list: $CARDS_IN_LIST_1"

if [ $CARDS_IN_LIST_1 -eq 2 ]; then
  echo -e "${GREEN}✓ Card deletion verified - correct card count${NC}"
else
  echo -e "${YELLOW}⚠ Unexpected card count (expected 2, got $CARDS_IN_LIST_1)${NC}"
fi

# Test 9: Move Card Again
echo -e "\n${YELLOW}9. MOVE MULTIPLE TIMES TEST${NC}"
CARD_FOR_MULTI_MOVE=${CARD_IDS[0]}
MOVE_RESPONSE_1=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_FOR_MULTI_MOVE" \
  -H "Content-Type: application/json" \
  -d "{\"idList\":\"$LIST_ID_2\"}")

MOVE_RESPONSE_2=$(curl -s -X PUT "$API_URL/api/tasks/$CARD_FOR_MULTI_MOVE" \
  -H "Content-Type: application/json" \
  -d "{\"idList\":\"$LIST_ID_3\"}")

if echo "$MOVE_RESPONSE_2" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Card moved multiple times successfully${NC}"
else
  echo -e "${RED}✗ Multiple moves failed${NC}"
fi

# Summary
echo -e "\n${YELLOW}================================${NC}"
echo -e "${GREEN}✓ All core tests completed${NC}"
echo -e "${YELLOW}================================${NC}"
echo -e "\n${YELLOW}Summary:${NC}"
echo -e "  • Board ID: $BOARD_ID"
echo -e "  • Cards Created: ${#CARD_IDS[@]}"
echo -e "  • Operations Tested:"
echo -e "    - Board creation"
echo -e "    - List retrieval"
echo -e "    - Card creation"
echo -e "    - Card update"
echo -e "    - Card move between lists"
echo -e "    - Card deletion"
echo -e "    - Multiple operations"
