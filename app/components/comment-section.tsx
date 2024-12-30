'use client'

import { useState, useEffect } from 'react'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { getVideoComments } from '@/lib/youtube'
import type { YouTubeComment } from '@/types/youtube'
import { formatTimeAgo } from '@/lib/youtube'

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<YouTubeComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await getVideoComments(videoId)
        setComments(response.items)
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement comment submission logic here
    setNewComment('')
  }

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="flex items-center mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmitComment} className="flex-1">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mr-2"
          />
          <Button type="submit" className="mt-2">Comment</Button>
        </form>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage 
                src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} 
                alt={`${comment.snippet.topLevelComment.snippet.authorDisplayName}'s avatar`}
              />
              <AvatarFallback>
                {comment.snippet.topLevelComment.snippet.authorDisplayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">
                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                <span className="font-normal text-sm text-muted-foreground ml-2">
                  {formatTimeAgo(comment.snippet.topLevelComment.snippet.publishedAt)}
                </span>
              </p>
              <p className="mt-1">{comment.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="flex items-center mt-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.snippet.topLevelComment.snippet.likeCount}
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                </Button>
                <Button variant="ghost" size="sm">Reply</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

