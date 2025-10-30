import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Add search filter if provided
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    // Add pagination if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 404 }
      );
    }

    // Format users
    const users = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      resumeToken: user.resume_token,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    // Get quiz response counts for each user
    const userIds = users.map((u) => u.id);
    const { data: responseCounts } = await supabase
      .from('quiz_responses')
      .select('user_id')
      .in('user_id', userIds);

    // Count responses per user
    const responseCountMap = (responseCounts || []).reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.user_id] = (acc[item.user_id] || 0) + 1;
        return acc;
      },
      {}
    );

    // Add response counts to users
    const usersWithCounts = users.map((user) => ({
      ...user,
      quizResponseCount: responseCountMap[user.id] || 0,
    }));

    return NextResponse.json(
      {
        users: usersWithCounts,
        total: count || users.length,
        count: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
