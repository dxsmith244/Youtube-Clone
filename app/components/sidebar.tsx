import Link from 'next/link'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Flame, Music2, Gamepad2, Newspaper, Trophy } from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: PlaySquare, label: 'Subscriptions', href: '/subscriptions' },
  { icon: Clock, label: 'History', href: '/history' },
  { icon: ThumbsUp, label: 'Liked videos', href: '/liked' },
  { icon: Flame, label: 'Trending', href: '/trending' },
  { icon: Music2, label: 'Music', href: '/music' },
  { icon: Gamepad2, label: 'Gaming', href: '/gaming' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Trophy, label: 'Sports', href: '/sports' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:block">
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-2">
        <div className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

