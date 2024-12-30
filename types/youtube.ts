export interface YouTubeVideo {
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
    channelTitle: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[]
  nextPageToken?: string
}

export interface YouTubeComment {
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

export interface YouTubeCommentResponse {
  items: YouTubeComment[]
  nextPageToken?: string
}

export interface YouTubeChannel {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
  }
  statistics: {
    subscriberCount: string
    videoCount: string
  }
}

