'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageSquareOff } from 'lucide-react'
import { getVideoComments, formatTimeAgo } from '@/lib/youtube'
import { decodeHtmlEntities } from '@/lib/utils'

interface Comment {
  id: string
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string
        authorProfileImageUrl: string
        textDisplay: string
        likeCount: number
        publishedAt: string
      }
    }
  }
}

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentsDisabled, setCommentsDisabled] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getVideoComments(videoId)
        if (response.commentsDisabled) {
          setCommentsDisabled(true)
        } else if (response.error) {
          setError(response.error)
        } else {
          setComments(response.items)
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
        setError('Failed to load comments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement comment submission logic here
    console.log('Submitting comment:', newComment)
    setNewComment('')
  }

  if (isLoading) {
    return <div className="mt-8 text-center">Loading comments...</div>
  }

  if (commentsDisabled) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center text-muted-foreground">
        <MessageSquareOff className="h-8 w-8 mb-2" />
        <p>Comments are turned off for this video.</p>
      </div>
    )
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="flex items-center mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="https://via.placeholder.com/32" alt="Your avatar" />
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
      {comments.length > 0 ? (
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
                <p className="mt-1">{decodeHtmlEntities(comment.snippet.topLevelComment.snippet.textDisplay)}</p>
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
      ) : (
        <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}

