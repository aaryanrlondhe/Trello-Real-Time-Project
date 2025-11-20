# Postman Collection for Trello Real-time API

This folder contains the Postman collection for testing all four required API endpoints and additional functionality.

## Collection Overview

### Required Endpoints (Assignment Requirement)
1. **POST /api/boards** - Create new board
2. **POST /api/tasks** - Create new card/task  
3. **PUT /api/tasks/:cardId** - Update existing card/task
4. **DELETE /api/tasks/:cardId** - Delete card/task

### Additional Test Endpoints
- Health check
- Get board details
- Get board lists  
- Webhook management
- Error handling tests

## How to Use

### 1. Import Collection
- Open Postman
- Click "Import" 
- Select `Trello-Realtime-API.postman_collection.json`
- The collection will be imported with all requests and tests

### 2. Set Environment Variables
The collection uses variables that are automatically set during execution:

**Manual Configuration Required:**
- `BASE_URL`: Set to your backend server URL (default: http://localhost:5000)
- `WEBHOOK_URL`: Set to your public webhook URL (ngrok or deployed URL)

**Automatically Set During Execution:**
- `BOARD_ID`: Set when creating a board
- `LIST_ID`: Set when fetching board lists
- `CARD_ID`: Set when creating tasks
- `WEBHOOK_ID`: Set when registering webhooks

### 3. Prerequisites
Before running the collection:

1. **Start your backend server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Configure Trello API credentials** in backend/.env:
   ```
   TRELLO_API_KEY=your_api_key
   TRELLO_API_TOKEN=your_api_token
   ```

3. **For webhook testing, expose your local server publicly**:
   ```bash
   # Install ngrok if not installed
   npm install -g ngrok
   
   # Expose local server
   ngrok http 5000
   ```
   
   Then update the `WEBHOOK_URL` variable in Postman with your ngrok URL.

### 4. Run the Collection

#### Option A: Run Individual Requests
Execute requests in this order for best results:
1. Health Check
2. Create Board
3. Get Board Lists  
4. Create Task
5. Update Task
6. Delete Task

#### Option B: Run Entire Collection
- Click the collection name
- Click "Run collection"
- Select all requests
- Click "Run Trello Real-time API"

### 5. Expected Results

All requests include automated tests that verify:
- ✅ Correct HTTP status codes
- ✅ Response structure validation
- ✅ Data integrity checks
- ✅ Real-time functionality verification

## Test Scenarios Covered

### Core API Functionality
- ✅ Board creation with default lists
- ✅ Task creation with title and description
- ✅ Task updates (title, description, list movement)
- ✅ Task deletion (archiving)

### Error Handling
- ✅ Invalid board ID handling
- ✅ Missing required field validation
- ✅ Malformed request handling

### Real-time Features
- ✅ Webhook registration
- ✅ WebSocket connection testing
- ✅ Real-time event broadcasting

## Automated Test Assertions

Each request includes comprehensive test scripts that check:

```javascript
// Example test from Create Task request
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has task data", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success', true);
    pm.expect(responseJson.data).to.have.property('id');
    pm.expect(responseJson.data).to.have.property('name');
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure backend server is running on port 5000
2. **Trello API Errors**: Verify API key and token in .env file
3. **Webhook Registration Fails**: Ensure WEBHOOK_URL is publicly accessible
4. **Test Failures**: Check if all prerequisites are met

### Debug Mode
Enable Postman Console to see detailed request/response logs:
- View → Show Postman Console
- Run requests to see detailed output

### Variables Not Set
If variables aren't being set automatically:
1. Check that requests are running in order
2. Verify test scripts are executing without errors
3. Look for error messages in the test results

## Integration with Frontend

When testing with the React frontend:
1. Start the backend server
2. Start the frontend: `cd frontend && npm start`
3. Open two browser windows to test real-time sync
4. Use Postman to create/update/delete tasks
5. Observe real-time updates in both browser windows

This demonstrates the complete real-time synchronization flow required by the assignment.