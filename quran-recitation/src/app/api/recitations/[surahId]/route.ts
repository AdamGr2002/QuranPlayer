import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { surahId: string } }
) {
  const surahId = params.surahId
  const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/1/${surahId}`)
  const data = await res.json()

  return NextResponse.json(data)
}