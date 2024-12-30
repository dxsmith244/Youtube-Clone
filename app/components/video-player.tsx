'use client'

import { useState } from 'react'

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const [isError, setIsError] = useState(false)

  if (isError) {
    return (
      <div className="aspect-w-16 aspect-h-9 bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Video unavailable</p>
          <p className="text-sm text-muted-foreground">
            This video is no longer available or cannot be played.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        onError={() => setIsError(true)}
      />
    </div>
  )
}

