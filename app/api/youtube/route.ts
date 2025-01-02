import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    console.error('YouTube API key is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const youtubeApiUrl = new URL(`${YOUTUBE_API_BASE_URL}/${path}`)
  searchParams.forEach((value, key) => {
    if (key !== 'path') {
      youtubeApiUrl.searchParams.append(key, value)
    }
  })
  youtubeApiUrl.searchParams.append('key', apiKey)

  try {
    const response = await fetch(youtubeApiUrl.toString())
    const data = await response.json()

    if (!response.ok) {
      console.error('YouTube API error:', JSON.stringify(data, null, 2))
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in YouTube API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

