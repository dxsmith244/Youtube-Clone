'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { formatViewCount, formatTimeAgo } from '@/lib/youtube'

interface Video {
  id: string
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
  statistics: {
    viewCount: string
  }
}

interface VideoGridProps {
  initialVideos: Video[]
}

export default function VideoGrid({ initialVideos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {initialVideos.map((video) => (
        <Link 
          key={video.id} 
          href={`/watch/${video.id}`}
        >
          <Card className="overflow-hidden hover:bg-accent transition-colors">
            <CardContent className="p-0">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatViewCount(video.statistics.viewCount)} views • {formatTimeAgo(video.snippet.publishedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

