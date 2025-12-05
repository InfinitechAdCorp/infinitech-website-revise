import { NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${LARAVEL_API_URL}/members/${params.id}`, {
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

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get FormData from request
    const formData = await request.formData();
    
    // Laravel expects _method field for PUT via FormData
    formData.append('_method', 'PUT');

    // Forward FormData to Laravel API using POST with _method override
    const response = await fetch(`${LARAVEL_API_URL}/members/${params.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Laravel API error: ${response.status}`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(`${LARAVEL_API_URL}/members/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Laravel API error: ${response.status}`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error patching member:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update member status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${LARAVEL_API_URL}/members/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Laravel API error: ${response.status}`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}