export async function searchVideos(query: string) {
  const params = new URLSearchParams({
    path: 'search',
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
  })

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/youtube?${params}`)
  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error searching videos:', errorData)
    throw new Error('Failed to search videos')
  }
  
  const data = await response.json()
  return data.items
}

export async function getVideoDetails(videoId: string) {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    id: videoId,
  })

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/youtube?${params}`)
  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error fetching video details:', errorData)
    throw new Error('Failed to fetch video details')
  }
  
  const data = await response.json()
  return data.items[0]
}

export async function getRelatedVideos(videoId: string) {
  const params = new URLSearchParams({
    path: 'search',
    part: 'snippet',
    type: 'video',
    maxResults: '10',
    relatedToVideoId: videoId,
  })

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/youtube?${params}`)
  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error fetching related videos:', errorData)
    throw new Error('Failed to fetch related videos')
  }
  
  const data = await response.json()
  return data.items
}

export function formatViewCount(count: string): string {
  const num = parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return count
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return `${years} years ago`
}

