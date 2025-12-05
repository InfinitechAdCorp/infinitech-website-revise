// app/api/solutions/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// GET - Fetch all solutions
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/solutions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch solutions')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching solutions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch solutions' },
      { status: 500 }
    )
  }
}

// POST - Create new solution (with file upload)
export async function POST(request: NextRequest) {
  try {
    // Get FormData from request
    const formData = await request.formData()

    // Log for debugging
    console.log('Sending to Laravel:', `${API_URL}/solutions`)
    
    // Forward FormData directly to Laravel API
    const response = await fetch(`${API_URL}/solutions`, {
      method: 'POST',
      body: formData, // Send FormData as-is, no JSON conversion
      // Don't set Content-Type - browser will set it with boundary
    })

    // Log response status
    console.log('Laravel response status:', response.status)

    // Check content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response from Laravel:', text)
      throw new Error('Laravel API returned an error. Check server logs.')
    }

    const data = await response.json()

    if (!response.ok) {
      console.error('Laravel error response:', data)
      throw new Error(data.message || 'Failed to create solution')
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating solution:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create solution' },
      { status: 500 }
    )
  }
}