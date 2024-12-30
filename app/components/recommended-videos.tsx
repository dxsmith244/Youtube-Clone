'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRelatedVideos } from '@/lib/youtube'
import type { YouTubeVideo } from '@/types/youtube'
import { formatViewCount, formatTimeAgo } from '@/lib/youtube'

export default function RecommendedVideos({ currentVideoId }: { currentVideoId: string }) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedVideos() {
      try {
        const response = await getRelatedVideos(currentVideoId)
        setVideos(response.items)
      } catch (error) {
        console.error('Failed to fetch related videos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedVideos()
  }, [currentVideoId])

  if (isLoading) {
    return <div>Loading recommendations...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
      <div className="space-y-4">
        {videos.map((video) => (
          <Link 
            key={video.id.videoId} 
            href={`/watch/${video.id.videoId}`} 
            className="flex group"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-40 h-24 object-cover rounded-lg mr-2"
              width={video.snippet.thumbnails.medium.width}
              height={video.snippet.thumbnails.medium.height}
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

