'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Youtube, Search, Bell, Video, Menu } from 'lucide-react'
import { ThemeToggle } from "./theme-toggle"
import { useSidebar } from '../contexts/SidebarContext'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { toggleSidebar, isExpanded } = useSidebar()

  useEffect(() => {
    console.log('Header component mounted')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleToggleSidebar = () => {
    console.log('Toggle sidebar button clicked')
    toggleSidebar()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center mr-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={handleToggleSidebar}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <span className="hidden font-bold sm:inline-block">
              YouTube Clone
            </span>
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" variant="secondary" className="rounded-l-none">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
            <span className="sr-only">Create</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

