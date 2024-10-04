import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://api.quran.com/api/v4/chapters?language=en')
  const data = await res.json()

  return NextResponse.json(data)
}