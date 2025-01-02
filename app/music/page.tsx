'use client'

import { useEffect, useState } from 'react'
import VideoGrid from '../components/video-grid'
import { getVideosByCategory, CATEGORY_IDS } from '@/lib/youtube'
import { useSidebar } from '../contexts/SidebarContext'
import { cn } from '@/lib/utils'

export default function MusicPage() {
  const { isExpanded } = useSidebar()
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setIsLoading(true)
        const data = await getVideosByCategory(CATEGORY_IDS.music)
        setVideos(data.items)
      } catch (err) {
        console.error('Error fetching music videos:', err)
        setError('Failed to load videos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (isLoading) return <LoadingMessage />
  if (error) return <ErrorMessage message={error} />
  if (!videos.length) return <NoVideosMessage />

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out p-4",
      isExpanded ? "lg:ml-64" : "lg:ml-16"
    )}>
      <h1 className="text-2xl font-bold mb-4">Music</h1>
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
        There are currently no music videos to display. Please check back later.
      </p>
    </div>
  )
}

