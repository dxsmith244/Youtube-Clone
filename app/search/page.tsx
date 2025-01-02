import { Suspense } from 'react'
import VideoGrid from '../components/video-grid'
import { searchVideos } from '@/lib/youtube'
import { Card } from "@/components/ui/card"

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  let videos = []

  try {
    videos = await searchVideos(query)
  } catch (error) {
    console.error('Error searching videos:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search results for: {query}</h1>
      <Suspense fallback={<LoadingGrid />}>
        {videos.length > 0 ? (
          <VideoGrid initialVideos={videos} />
        ) : (
          <NoResultsMessage query={query} />
        )}
      </Suspense>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="animate-pulse">
            <div className="bg-muted aspect-video" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function NoResultsMessage({ query }: { query: string }) {
  return (
    <div className="text-center py-10">
      <p className="text-xl text-muted-foreground">
        No results found for &quot;{query}&quot;. Please try a different search term.
      </p>
    </div>
  )
}

