import { NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${LARAVEL_API_URL}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Laravel API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch members',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get FormData from request
    const formData = await request.formData();

    // Forward FormData directly to Laravel API
    const response = await fetch(`${LARAVEL_API_URL}/members`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type - let fetch set it automatically for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Laravel API error: ${response.status}`);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}