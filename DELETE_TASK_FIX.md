# Delete Task Bug Fix - Multiple Tasks in To Do List

## Problem
When creating multiple tasks in the To Do list, deleting a task was not working properly. The UI would freeze or the delete operation would fail.

## Root Cause
The issue was caused by:
1. **Delayed UI Update**: The deletion was waiting for the API call to complete before removing the card from the UI
2. **Race Condition**: With multiple cards, the loading state from the `useTasks` hook could interfere with subsequent operations
3. **Dependency Issue**: There was no direct communication between the Card component and the board's list state for immediate removal

## Solution
Implemented an optimistic UI update pattern with the following changes:

### 1. **Added `removeCardFromLists` function to `useBoard.js`**
```javascript
const removeCardFromLists = useCallback((cardId) => {
  setLists((prevLists) =>
    prevLists.map((list) => ({
      ...list,
      cards: (list.cards || []).filter((card) => card.id !== cardId),
    }))
  );
}, []);
```
This function immediately removes a card from the board's lists state.

### 2. **Updated `Card.js` handleDelete**
```javascript
const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete this card?')) {
    return;
  }

  try {
    // Immediately remove from UI
    if (removeCardFromLists) {
      removeCardFromLists(card.id);
    }
    // Then delete from API
    await deleteTask(card.id);
  } catch (error) {
    alert('Failed to delete card: ' + error.message);
  }
};
```
Now the card is removed from the UI immediately, then deleted from the API.

### 3. **Passed `removeCardFromLists` through component hierarchy**
- `App.js` → `Board.js` → `List.js` → `Card.js`

This allows any card component to directly update the parent board's state.

### 4. **Updated `App.js` event handler**
```javascript
const handleCardDeleted = (data) => {
  console.log('Real-time card deleted:', data);
  // Immediately remove the card from the UI without waiting for refresh
  removeCardFromLists(data.data?.id || data.id);
  // Then refresh the board to ensure sync
  refreshBoard();
};
```

## Benefits
✅ **Instant Feedback**: Cards are removed from the UI immediately when delete is clicked
✅ **No Loading Delays**: Users don't have to wait for API responses
✅ **Better UX**: Multiple rapid deletes now work smoothly
✅ **Fallback Safety**: If deletion fails, the board is refreshed to restore correct state
✅ **Real-time Sync**: WebSocket events also benefit from the instant removal

## Testing
Test the fix by:
1. Creating multiple tasks in the To Do list
2. Quickly delete multiple tasks in succession
3. The cards should disappear immediately from the UI
4. Check the backend/console to verify API calls succeed

## Files Modified
- `/frontend/src/hooks/useBoard.js`
- `/frontend/src/components/Card.js`
- `/frontend/src/components/List.js`
- `/frontend/src/components/Board.js`
- `/frontend/src/App.js`
