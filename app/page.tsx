import VideoGrid from './components/video-grid'
import { Card } from "./components/ui/card"

async function getTrendingVideos() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/youtube/trending`, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export default async function Home() {
  let data
  try {
    data = await getTrendingVideos()
  } catch (error) {
    console.error('Error fetching trending videos:', error)
    return <ErrorMessage />
  }

  if (!data?.items?.length) {
    return <NoVideosMessage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trending Videos</h1>
      <VideoGrid initialVideos={data.items} />
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        We're having trouble loading the videos. Please try again later.
      </p>
    </div>
  )
}

function NoVideosMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">No Videos Available</h2>
      <p className="text-muted-foreground mb-6">
        There are currently no trending videos to display. Please check back later.
      </p>
    </div>
  )
}

