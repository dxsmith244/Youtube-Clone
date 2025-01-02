import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/header'
import Sidebar from './components/sidebar'
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from './contexts/SidebarContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube Clone',
  description: 'A comprehensive YouTube clone built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1 pt-14">
                <Sidebar />
                <main className="flex-1 overflow-y-auto pl-16 lg:pl-64 transition-all duration-300 ease-in-out p-4">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

