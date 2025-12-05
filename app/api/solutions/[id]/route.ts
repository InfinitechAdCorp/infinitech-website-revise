// app/api/solutions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// GET - Fetch single solution
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/solutions/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch solution')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching solution:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch solution' },
      { status: 500 }
    )
  }
}

// POST - Update solution (using POST with _method for FormData)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get FormData from request
    const formData = await request.formData()
    
    // Laravel expects _method=PUT for updates via FormData
    formData.append('_method', 'PUT')

    // Forward FormData directly to Laravel API
    const response = await fetch(`${API_URL}/solutions/${params.id}`, {
      method: 'POST', // Use POST with _method override
      body: formData,
      // Don't set Content-Type - browser will set it with boundary
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update solution')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating solution:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update solution' },
      { status: 500 }
    )
  }
}

// DELETE - Delete solution
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/solutions/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete solution')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting solution:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete solution' },
      { status: 500 }
    )
  }
}