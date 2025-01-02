'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRelatedVideos, formatTimeAgo } from '@/lib/youtube'

interface Video {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: { medium: { url: string, width: number, height: number } }
  }
}

export default function RecommendedVideos({ currentVideoId }: { currentVideoId: string }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRelatedVideos() {
      try {
        setIsLoading(true)
        setError(null)
        const relatedVideos = await getRelatedVideos(currentVideoId)
        setVideos(relatedVideos)
      } catch (error) {
        console.error('Failed to fetch related videos:', error)
        setError('Failed to load recommendations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedVideos()
  }, [currentVideoId])

  if (isLoading) {
    return <div>Loading recommendations...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!videos.length) {
    return <div>No recommendations available</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
      <div className="space-y-4">
        {videos.map((video) => (
          <Link 
            key={video.id?.videoId || video.id} 
            href={`/watch/${video.id?.videoId || video.id}`} 
            className="flex group"
          >
            <Image
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              width={video.snippet.thumbnails.medium.width}
              height={video.snippet.thumbnails.medium.height}
              className="w-40 h-24 object-cover rounded-lg mr-2"
            />
            <div>
              <h3 className="font-semibold line-clamp-2 group-hover:text-blue-500">
                {video.snippet.title}
              </h3>
              <p className="text-sm text-muted-foreground">{video.snippet.channelTitle}</p>
              <p className="text-sm text-muted-foreground">
                {formatTimeAgo(video.snippet.publishedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

