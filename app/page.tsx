'use client'

import { useEffect, useState } from 'react'
import VideoGrid from './components/video-grid'
import { getRecommendedVideos } from '@/lib/youtube'
import { useSidebar } from './contexts/SidebarContext'
import { cn } from '@/lib/utils'

export default function Home() {
  const { isExpanded } = useSidebar()
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setIsLoading(true)
        const data = await getRecommendedVideos()
        if (!data || data.length === 0) {
          throw new Error('No videos returned from API')
        }
        setVideos(data)
      } catch (err) {
        console.error('Error fetching recommended videos:', err)
        setError(err.message || 'Failed to load videos. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (isLoading) return <LoadingMessage />
  if (error) return <ErrorMessage message={error} />
  if (!videos || videos.length === 0) return <NoVideosMessage />

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out p-4",
      isExpanded ? "lg:ml-64" : "lg:ml-16"
    )}>
      <h1 className="text-2xl font-bold mb-4">Recommended for You</h1>
      <VideoGrid initialVideos={videos} />
    </div>
  )
}

function LoadingMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Loading videos...</p>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
    </div>
  )
}

function NoVideosMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">No Videos Available</h2>
      <p className="text-muted-foreground mb-6">
        There are currently no recommended videos to display. Please check back later.
      </p>
    </div>
  )
}

