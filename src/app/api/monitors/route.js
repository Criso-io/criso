import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../auth/[...nextauth]/route'

export const revalidate = 30 // Revalidate every 30 seconds

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, url, frequency } = await req.json()

    // Validate required fields
    if (!name || !url || !frequency) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Validate frequency is one of the allowed values
    if (![1, 5, 10, 15].includes(parseInt(frequency))) {
      return new NextResponse('Invalid frequency value', { status: 400 })
    }

    // First get the user's UUID from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return new NextResponse('User not found', { status: 404 })
    }

    // Create new monitor using the user's Supabase UUID
    const { data, error } = await supabase
      .from('monitors')
      .insert({
        name,
        url,
        frequency: parseInt(frequency),
        user_id: userData.id,  // Use the actual UUID from the users table
        is_active: true,
        last_check_at: null,
        last_status: null,
        last_response_time: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating monitor:', error)
      return new NextResponse('Failed to create monitor', { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Single query to get monitors directly
    const { data, error } = await supabase
      .from('monitors')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching monitors:', error)
      return new NextResponse('Failed to fetch monitors', { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 