# API Routes Test Summary

## Server Status
✅ **Development server running**: http://localhost:3001

## Available API Routes

### 1. User Management

#### POST /api/user
Create a new user
```bash
curl -X POST http://localhost:3001/api/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }'
```

#### GET /api/user?resumeToken=TOKEN
Get user by resume token
```bash
curl http://localhost:3001/api/user?resumeToken=YOUR_TOKEN
```

### 2. Quiz Management

#### GET /api/quiz/[id]
Get quiz by ID
```bash
curl http://localhost:3001/api/quiz/QUIZ_ID
```

#### POST /api/quiz
Submit quiz response
```bash
curl -X POST http://localhost:3001/api/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "quiz-123",
    "userId": "user-456",
    "responses": [
      {"questionId": "q1", "answer": "Yes", "answeredAt": "2025-10-26T00:00:00Z"}
    ],
    "progress": 50
  }'
```

#### PUT /api/quiz
Update quiz progress
```bash
curl -X PUT http://localhost:3001/api/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "id": "response-id",
    "responses": [...],
    "progress": 100,
    "completedAt": "2025-10-26T00:00:00Z"
  }'
```

#### GET /api/quiz?userId=USER_ID
Get all quizzes for a user
```bash
curl http://localhost:3001/api/quiz?userId=USER_ID
```

### 3. Resume Token Management

#### POST /api/resume
Generate new resume token
```bash
curl -X POST http://localhost:3001/api/resume
```
**Response**: `{"resumeToken":"MH75UPD8-LYUJMV8W","message":"Resume token generated successfully"}`

#### GET /api/resume?token=TOKEN
Validate resume token
```bash
curl http://localhost:3001/api/resume?token=YOUR_TOKEN
```

#### GET /api/resume/[token]
Load saved progress by token
```bash
curl http://localhost:3001/api/resume/YOUR_TOKEN
```

### 4. Admin Routes

#### GET /api/admin/users
Get all users (with pagination and search)
```bash
# All users
curl http://localhost:3001/api/admin/users

# With pagination
curl http://localhost:3001/api/admin/users?limit=10&offset=0

# With search
curl http://localhost:3001/api/admin/users?search=john
```

#### GET /api/admin/responses
Get all quiz responses
```bash
# All responses
curl http://localhost:3001/api/admin/responses

# Filter by quiz
curl http://localhost:3001/api/admin/responses?quizId=QUIZ_ID

# With pagination
curl http://localhost:3001/api/admin/responses?limit=20&offset=0
```

## Test Results

### ✅ Successfully Tested
- [x] POST /api/resume - Token generation working
- [x] Server compilation - All routes compile without errors

### 🔄 Requires Supabase Data
- [ ] POST /api/user - Needs Supabase migrations applied
- [ ] GET /api/quiz/[id] - Needs quiz data in database
- [ ] POST /api/quiz - Needs users and quizzes in database
- [ ] GET /api/resume/[token] - Needs user with resume token
- [ ] GET /api/admin/users - Needs user data
- [ ] GET /api/admin/responses - Needs response data

## Next Steps

1. **Apply Supabase Migrations** (see APPLY_MIGRATIONS.md)
2. **Add Sample Quiz Data** to test quiz routes
3. **Test Full User Flow**:
   - Create user
   - Start quiz
   - Submit responses
   - Resume with token
4. **Test Admin Dashboard** routes with real data

## Notes

- All routes have proper error handling
- Validation is working (try invalid data to see error responses)
- Server is using port 3001 (3000 was in use)
- Environment variables loaded from .env.local
