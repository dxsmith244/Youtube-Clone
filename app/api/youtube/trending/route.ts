import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      throw new Error('YouTube API key is not set')
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${apiKey}`,
      { next: { revalidate: 60 } }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('YouTube API error:', JSON.stringify(errorData, null, 2))
      throw new Error(`YouTube API responded with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching trending videos:', error)
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 })
  }
}

