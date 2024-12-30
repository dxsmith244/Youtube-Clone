import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react'
import { formatViewCount, formatTimeAgo } from '@/lib/youtube'

interface VideoDescriptionProps {
  video: any // You might want to create a proper type for this
}

export default function VideoDescription({ video }: VideoDescriptionProps) {
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">{video.snippet.title}</h1>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://i.ytimg.com/vi/${video.id}/default.jpg`} alt={video.snippet.channelTitle} />
            <AvatarFallback>{video.snippet.channelTitle[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="font-semibold">{video.snippet.channelTitle}</p>
            <p className="text-sm text-muted-foreground">
              {formatViewCount(video.statistics.viewCount)} views • {formatTimeAgo(video.snippet.publishedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm">
            <ThumbsUp className="h-4 w-4 mr-2" />
            {formatViewCount(video.statistics.likeCount)}
          </Button>
          <Button variant="secondary" size="sm">
            <ThumbsDown className="h-4 w-4 mr-2" />
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <p className="mt-4 text-sm">{video.snippet.description}</p>
    </div>
  )
}

