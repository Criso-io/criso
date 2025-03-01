import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // First verify the user owns this monitor
    const { data: monitor, error: monitorError } = await supabase
      .from('monitors')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (monitorError || !monitor) {
      return new NextResponse('Monitor not found', { status: 404 })
    }

    // Get the 10 most recent checks
    const { data: checks, error: checksError } = await supabase
      .from('monitor_checks')
      .select('*')
      .eq('monitor_id', params.id)
      .order('checked_at', { ascending: false })
      .limit(10)

    if (checksError) {
      console.error('Error fetching checks:', checksError)
      return new NextResponse('Failed to fetch checks', { status: 500 })
    }

    return NextResponse.json(checks)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 