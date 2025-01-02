'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Compass, Flame, Music2, Gamepad2, Newspaper, Trophy } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Flame, label: 'Trending', href: '/trending' },
  { icon: Music2, label: 'Music', href: '/music' },
  { icon: Gamepad2, label: 'Gaming', href: '/gaming' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Trophy, label: 'Sports', href: '/sports' },
]

export default function Sidebar() {
  const { isExpanded } = useSidebar()

  return (
    <aside className={cn(
      "fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-background transition-all duration-300 ease-in-out z-40",
      isExpanded ? "w-64" : "w-16",
      "lg:translate-x-0",
      isExpanded ? "translate-x-0" : "-translate-x-full",
      "lg:block"
    )}>
      <ScrollArea className="h-full py-2">
        <div className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className={cn(
                "w-full justify-start",
                !isExpanded && "justify-center px-0"
              )}>
                <item.icon className="h-4 w-4 mr-2" />
                {isExpanded && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

