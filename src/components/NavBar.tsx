'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Map, LayoutDashboard, Camera, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/map', label: 'マップ', icon: Map },
  { href: '/photos', label: '写真', icon: Camera },
]

export function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:static md:border-t-0 md:border-r md:w-64 md:h-screen md:flex md:flex-col">
      {/* Desktop header */}
      <div className="hidden md:flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <MapPin className="text-indigo-600" size={24} />
        <span className="font-bold text-lg text-gray-900">旅と学び</span>
      </div>

      {/* Nav items */}
      <div className="flex md:flex-col md:flex-1 md:py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 px-3 md:px-6 py-3 md:py-3 text-sm font-medium transition-colors',
              pathname === href
                ? 'text-indigo-600 bg-indigo-50 md:border-r-2 md:border-indigo-600'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon size={20} />
            <span className="hidden md:block">{label}</span>
          </Link>
        ))}
      </div>

      {/* User section */}
      {session && (
        <div className="hidden md:flex items-center justify-between px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            <span className="text-sm text-gray-700 truncate">{session.user?.name}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="ログアウト"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </nav>
  )
}
