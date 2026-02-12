import Link from 'next/link'
import { createClient } from '../../supabase/server'
import UserProfile from './user-profile'

export default async function Navbar() {
  const supabase = createClient()

  const { data: { user } } = await (await supabase).auth.getUser()


  return (
    <nav className="w-full border-b-4 border-[#1a1a1a] bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-2xl font-black uppercase">
          🪽 Sonny Alert
        </Link>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-6 py-3 text-sm font-black uppercase border-2 border-[#1a1a1a] bg-white hover:bg-[#f5f5f5] transition-all duration-200 active:scale-95"
              >
                Dashboard
              </Link>
              <UserProfile  />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-6 py-3 text-sm font-black uppercase border-2 border-[#1a1a1a] bg-white hover:bg-[#f5f5f5] transition-all duration-200 active:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 text-sm font-black uppercase text-white bg-[#ff69b4] border-2 border-[#1a1a1a] hover:bg-[#ff1493] transition-all duration-200 active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
