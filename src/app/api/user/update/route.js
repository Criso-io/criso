import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    const { name } = data

    if (typeof name !== 'string' || !name.trim()) {
      return new NextResponse('Invalid name', { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .update({ name: name.trim() })
      .eq('id', session.user.id)

    if (error) {
      console.error('Error updating user in database:', error)
      return new NextResponse('Failed to update user', { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 