import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import VideoPlayer from '../../../app/components/video-player'
import VideoDescription from '../../../app/components/video-description'
import CommentSection from '../../../app/components/comment-section'
import RecommendedVideos from '../../../app/components/recommended-videos'
import { getVideoDetails } from '@/lib/youtube'

export default async function WatchPage({ params }: { params: { id: string } }) {
  const { id } = params
  let videoData

  try {
    videoData = await getVideoDetails(id)
    if (!videoData) {
      notFound()
    }
  } catch (error) {
    console.error('Failed to fetch video data:', error)
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer videoId={id} />
          <Suspense fallback={<div>Loading video details...</div>}>
            <VideoDescription video={videoData} />
          </Suspense>
          <Suspense fallback={<div>Loading comments...</div>}>
            <CommentSection videoId={id} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading recommendations...</div>}>
            <RecommendedVideos currentVideoId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

