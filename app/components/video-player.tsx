'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from "../components/ui/button"

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const attemptAutoplay = async () => {
      try {
        if (iframeRef.current) {
          await iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Autoplay failed:', error)
      }
    }

    attemptAutoplay()

    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data)
          if (data.event === 'onStateChange' && data.info === 1) {
            setIsPlaying(true)
          }
        } catch (error) {
          console.error('Error parsing message:', error)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&origin=${encodeURIComponent(window.location.origin)}`;
    }
  }, [videoId]);

  const toggleMute = () => {
    if (iframeRef.current) {
      const message = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}'
      iframeRef.current.contentWindow?.postMessage(message, '*')
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative w-full pt-[56.25%] bg-gray-900 rounded-xl overflow-hidden">
      <iframe
        ref={iframeRef}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
      {isPlaying && (
        <Button 
          onClick={toggleMute}
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}

