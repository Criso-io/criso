import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Vercel Cron Job handler - runs every minute
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max duration

async function performCheck(monitor) {
  const startTime = Date.now()
  let status = false
  let statusCode = null
  let errorMessage = null
  let responseTime = null

  try {
    const response = await fetch(monitor.url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Criso-Monitor/1.0',
      },
      // 30 second timeout
      signal: AbortSignal.timeout(30000),
    })

    responseTime = Date.now() - startTime
    statusCode = response.status
    status = response.ok // true if status is 2xx
  } catch (error) {
    responseTime = Date.now() - startTime
    errorMessage = error.message
    status = false
  }

  // Record the check result
  const { error: checkError } = await supabase
    .from('monitor_checks')
    .insert({
      monitor_id: monitor.id,
      status,
      response_time: responseTime,
      status_code: statusCode,
      error_message: errorMessage,
    })

  if (checkError) {
    console.error('Error recording check:', checkError)
    return false
  }

  // Update the monitor's last status
  const { error: updateError } = await supabase
    .from('monitors')
    .update({
      last_check_at: new Date().toISOString(),
      last_status: status,
      last_response_time: responseTime,
    })
    .eq('id', monitor.id)

  if (updateError) {
    console.error('Error updating monitor:', updateError)
    return false
  }

  return true
}

export async function GET(req) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get all active monitors
    const { data: monitors, error } = await supabase
      .from('monitors')
      .select('*')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching monitors:', error)
      return new NextResponse('Error fetching monitors', { status: 500 })
    }

    // Filter monitors that need to be checked based on frequency and last check time
    const now = new Date()
    const monitorsToCheck = monitors.filter(monitor => {
      if (!monitor.last_check_at) return true
      
      const lastCheck = new Date(monitor.last_check_at)
      const minutesSinceLastCheck = (now - lastCheck) / 1000 / 60
      return minutesSinceLastCheck >= monitor.frequency
    })

    // Perform checks in parallel
    const checkPromises = monitorsToCheck.map(performCheck)
    await Promise.all(checkPromises)

    return NextResponse.json({
      success: true,
      checksPerformed: monitorsToCheck.length,
    })
  } catch (error) {
    console.error('Error in check worker:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 