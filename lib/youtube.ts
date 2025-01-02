function getBaseUrl() {
  return typeof window === 'undefined' 
    ? process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    : ''
}

const API_BASE_URL = '/api/youtube'

async function fetchFromAPI(params: URLSearchParams) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${API_BASE_URL}?${params}`)
  if (!response.ok) {
    const errorData = await response.json()
    console.error('API Error:', errorData)
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export async function searchVideos(query: string) {
  const params = new URLSearchParams({
    path: 'search',
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
  })

  try {
    const data = await fetchFromAPI(params)
    return data.items || []
  } catch (error) {
    console.error('Error searching videos:', error)
    return []
  }
}

export async function getVideoDetails(videoId: string) {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    id: videoId,
  })

  try {
    const data = await fetchFromAPI(params)
    return data.items[0]
  } catch (error) {
    console.error('Error fetching video details:', error)
    throw error
  }
}

export async function getRelatedVideos(videoId: string) {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: '10',
    regionCode: 'US'
  })

  try {
    const data = await fetchFromAPI(params)
    return data.items || []
  } catch (error) {
    console.error('Error fetching related videos:', error)
    return []
  }
}

export async function getVideoComments(videoId: string) {
  const params = new URLSearchParams({
    path: 'commentThreads',
    part: 'snippet,replies',
    videoId: videoId,
    maxResults: '20',
    order: 'relevance'
  })

  try {
    const response = await fetch(`${getBaseUrl()}${API_BASE_URL}?${params}`)
    const data = await response.json()
    
    if (!response.ok || data.error) {
      console.error('Error fetching video comments:', data)
      return { 
        items: [], 
        commentsDisabled: true,
        error: 'Comments are not available for this video.'
      }
    }
    
    return { 
      items: data.items || [], 
      commentsDisabled: false 
    }
  } catch (error) {
    console.error('Error in getVideoComments:', error)
    return { 
      items: [], 
      commentsDisabled: true, 
      error: 'Failed to load comments' 
    }
  }
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

export async function getTrendingVideos() {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    chart: 'mostPopular',
    regionCode: 'US',
    maxResults: '20'
  })

  try {
    const data = await fetchFromAPI(params)
    return data
  } catch (error) {
    console.error('Error fetching trending videos:', error)
    throw error
  }
}

export async function getVideosByCategory(categoryId: string, maxResults: number = 20) {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    chart: 'mostPopular',
    videoCategoryId: categoryId,
    maxResults: maxResults.toString(),
    regionCode: 'US'
  })

  try {
    const data = await fetchFromAPI(params)
    return data
  } catch (error) {
    console.error('Error fetching videos by category:', error)
    throw error
  }
}

export const CATEGORY_IDS = {
  trending: '0',
  music: '10',
  gaming: '20',
  news: '25',
  sports: '17'
}

export async function getSimilarVideos(maxResults: number = 20) {
  const params = new URLSearchParams({
    path: 'videos',
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: maxResults.toString(),
    regionCode: 'US'
  })

  try {
    const data = await fetchFromAPI(params)
    if (!data || !data.items) {
      console.error('Invalid response from getSimilarVideos:', data)
      throw new Error('Invalid response from API in getSimilarVideos')
    }
    return data.items
  } catch (error) {
    console.error('Error in getSimilarVideos:', error)
    throw error
  }
}

export async function getExploreVideos(maxResults: number = 20) {
  const categories = Object.values(CATEGORY_IDS)
  const videosPerCategory = Math.floor(maxResults / categories.length)

  try {
    const videoPromises = categories.map(categoryId => 
      getVideosByCategory(categoryId, videosPerCategory)
    )
    const categoryResults = await Promise.all(videoPromises)
    
    const allVideos = categoryResults.flatMap(result => {
      if (!result || !result.items) {
        console.error('Invalid result in getExploreVideos:', result)
        return []
      }
      return result.items
    })

    if (allVideos.length === 0) {
      console.error('No videos fetched in getExploreVideos')
      throw new Error('No videos fetched in getExploreVideos')
    }

    return shuffleArray(allVideos).slice(0, maxResults)
  } catch (error) {
    console.error('Error in getExploreVideos:', error)
    throw error
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getRecommendedVideos(maxResults: number = 20) {
  try {
    const [similarVideos, categoryVideos] = await Promise.all([
      getSimilarVideos(maxResults),
      getExploreVideos(maxResults)
    ])

    if (!similarVideos || !categoryVideos) {
      console.error('Invalid results in getRecommendedVideos:', { similarVideos, categoryVideos })
      throw new Error('Failed to fetch videos in getRecommendedVideos')
    }

    const seenIds = new Set()
    const recommendedVideos = [
      ...similarVideos,
      ...categoryVideos
    ].filter(video => {
      if (!video || (!video.id && !video.id?.videoId)) {
        console.error('Invalid video object:', video)
        return false
      }
      const id = video.id?.videoId || video.id
      if (seenIds.has(id)) {
        return false
      }
      seenIds.add(id)
      return true
    })

    if (recommendedVideos.length === 0) {
      console.error('No recommended videos after filtering')
      throw new Error('No recommended videos available')
    }

    return shuffleArray(recommendedVideos).slice(0, maxResults)
  } catch (error) {
    console.error('Error in getRecommendedVideos:', error)
    throw error
  }
}

