# Clearing Quiz Responses - Implementation Guide

This guide provides several approaches to clearing quiz responses in the admin/database for the AI Training Survey PWA.

## Recommended Approaches

### 1. **Supabase Dashboard (Quick & Safe)**
The easiest way for immediate needs:
- Go to your Supabase project dashboard
- Navigate to Table Editor → `quiz_responses`
- Select responses to delete or use SQL query:
  ```sql
  DELETE FROM quiz_responses WHERE user_id = 'specific-user-id';
  -- or to clear ALL responses:
  DELETE FROM quiz_responses;
  ```

### 2. **Admin API Route (Recommended for Production)**
Create a protected admin endpoint:

```typescript
// app/api/admin/clear-responses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function DELETE(request: NextRequest) {
  // Add authentication check here
  const { userId, quizId } = await request.json();

  // Clear specific user's responses
  if (userId) {
    const { error } = await db.supabase
      .from('quiz_responses')
      .delete()
      .eq('user_id', userId);
    return NextResponse.json({ success: !error });
  }

  // Clear specific quiz responses
  if (quizId) {
    const { error } = await db.supabase
      .from('quiz_responses')
      .delete()
      .eq('quiz_id', quizId);
    return NextResponse.json({ success: !error });
  }

  // Clear ALL responses (use with caution)
  const { error } = await db.supabase
    .from('quiz_responses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

  return NextResponse.json({ success: !error });
}
```

### 3. **Database Helper Function**
Add to `lib/supabaseClient.ts`:

```typescript
// Add to db object
clearQuizResponses: async (options?: { userId?: string; quizId?: string }) => {
  let query = supabase.from('quiz_responses').delete();

  if (options?.userId) query = query.eq('user_id', options.userId);
  if (options?.quizId) query = query.eq('quiz_id', options.quizId);
  if (!options?.userId && !options?.quizId) {
    query = query.neq('id', '00000000-0000-0000-0000-000000000000');
  }

  return await query;
}
```

### 4. **Don't Forget IndexedDB**
For offline data, users also have responses cached locally. To clear those:

```typescript
// lib/utils/storage.ts - add helper
export async function clearAllResponses(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(['quiz_responses'], 'readwrite');
  await tx.objectStore('quiz_responses').clear();
  await tx.done;
}
```

## Best Practice Approach

For a production admin panel, the recommended approach includes:

1. **Create an admin UI** with authentication
2. **Add a "Clear Responses" button** that calls the API route
3. **Include confirmation dialog** before deletion
4. **Add filters**: by user, by quiz, by date range
5. **Consider soft deletes** instead (add `deleted_at` column) for audit trail

## Implementation Priority

1. **Immediate needs**: Use Supabase Dashboard (Option 1)
2. **Short-term**: Add database helper function (Option 3)
3. **Production-ready**: Implement admin API route (Option 2)
4. **Complete solution**: Build admin UI with all features

## Security Considerations

- Always implement authentication for admin endpoints
- Add confirmation dialogs before destructive operations
- Consider role-based access control (RBAC)
- Log all deletion operations for audit trail
- Use soft deletes in production to preserve data history

## Usage Examples

### Using Database Helper
```typescript
// Clear all responses for a specific user
await db.clearQuizResponses({ userId: 'user-uuid' });

// Clear all responses for a specific quiz
await db.clearQuizResponses({ quizId: 'quiz-uuid' });

// Clear ALL responses (careful!)
await db.clearQuizResponses();
```

### Using API Route
```typescript
// From admin UI
const response = await fetch('/api/admin/clear-responses', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user-uuid' })
});
```

## Future Enhancements

- Batch operations for multiple users/quizzes
- Export responses before deletion
- Scheduled cleanup for old responses
- Admin dashboard with analytics before clearing
- Restore functionality for soft deletes
