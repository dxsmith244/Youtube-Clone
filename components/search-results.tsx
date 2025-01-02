'use client'

import { useState, useEffect } from 'react'
import { fetchFromAPI } from '@/lib/youtube'
import VideoGrid from './video-grid'

interface SearchResultsProps {
  query: string
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          path: 'search',
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: '20'
        })
        const data = await fetchFromAPI(params)
        setVideos(data.items || [])
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('Failed to load search results. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (videos.length === 0) return <div>No results found for "{query}"</div>

  return <VideoGrid initialVideos={videos} />
}

