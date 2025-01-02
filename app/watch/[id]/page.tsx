import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import VideoPlayer from '../../components/video-player'
import VideoDescription from '../../components/video-description'
import CommentSection from '../../components/comment-section'
import RecommendedVideos from '../../components/recommended-videos'
import { getVideoDetails } from '@/lib/youtube'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WatchPage({ params }: PageProps) {
  const resolvedParams = await params
  
  if (!resolvedParams?.id) {
    notFound()
  }

  let videoData
  try {
    videoData = await getVideoDetails(resolvedParams.id)
    if (!videoData) {
      notFound()
    }
  } catch (error) {
    console.error('Failed to fetch video data:', error)
    notFound()
  }

  return (
    <div className="max-w-[2000px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <div className="max-w-[1600px] mx-auto">
            <VideoPlayer videoId={resolvedParams.id} />
            <Suspense fallback={<div>Loading video details...</div>}>
              <VideoDescription video={videoData} />
            </Suspense>
            <Suspense fallback={<div>Loading comments...</div>}>
              <CommentSection videoId={resolvedParams.id} />
            </Suspense>
          </div>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading recommendations...</div>}>
            <RecommendedVideos currentVideoId={resolvedParams.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

