'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { formatViewCount, formatTimeAgo } from '@/lib/youtube'

interface Video {
  id: string | { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
  }
  statistics?: {
    viewCount: string
  }
}

interface VideoGridProps {
  initialVideos: Video[]
}

export default function VideoGrid({ initialVideos }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)

  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  if (!videos || videos.length === 0) {
    return <div>No videos available.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => {
        const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
        return (
          <Link 
            key={videoId} 
            href={`/watch/${videoId}`}
          >
            <Card className="overflow-hidden hover:bg-accent transition-colors">
              <CardContent className="p-0">
                <Image
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  width={video.snippet.thumbnails.medium.width}
                  height={video.snippet.thumbnails.medium.height}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/placeholder.svg?height=180&width=320"
                />
                <div className="p-2">
                  <h3 className="font-semibold line-clamp-2 text-sm">
                    {video.snippet.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {video.statistics ? `${formatViewCount(video.statistics.viewCount)} views • ` : ''}
                    {formatTimeAgo(video.snippet.publishedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  )
}

