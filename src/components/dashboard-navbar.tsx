'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UserCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <nav className="w-full border-b-4 border-[#1a1a1a] bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-2xl font-black uppercase">
            🪽 Sonny Alert
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-12 h-12 border-2 border-[#1a1a1a] bg-white hover:bg-[#f5f5f5] flex items-center justify-center transition-all duration-200 active:scale-95">
                <UserCircle className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-2 border-[#1a1a1a]">
              <DropdownMenuItem 
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/")
                }}
                className="font-bold cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
