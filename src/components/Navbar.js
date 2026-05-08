'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { logout } from '@/lib/actions/auth';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar({ session }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!session;
  const role = session?.role;

  const navLinks = () => {
    const links = [{ href: '/projects', label: 'Browse Projects' }];
    links.push({ href: '/find-talent', label: 'Find Talent' });
    if (isAuthenticated) {
      links.push({ href: role === 'student' ? '/student/dashboard' : '/client/dashboard', label: 'Dashboard' });
      links.push({ href: role === 'student' ? '/student/wallet' : '/client/wallet', label: 'Wallet' });
      if (role === 'student') {
        links.push({ href: '/student/invitations', label: 'Invitations' });
      }
    }
    return links;
  };

  return (
    <header className="bg-background w-full flex justify-center px-4 md:px-8 py-6 border-b border-border/10">
      <div className="flex items-center justify-between w-full max-w-7xl">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="PostLance Logo" width={140} height={40} className="h-10 w-auto" />
        </Link>

        {isMobile ? (
          <>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#181717]">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {mobileOpen && (
              <div className="absolute top-[88px] left-0 right-0 bg-white border-b border-border/10 p-6 shadow-xl z-50">
                <nav className="flex flex-col gap-4">
                  {navLinks().map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-[15px] font-medium transition-colors',
                        pathname === link.href ? 'text-primary' : 'text-[#181717] hover:text-primary'
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="border-t border-border/10 pt-6 mt-2 flex flex-col gap-4">
                    {isAuthenticated ? (
                      <>
                        <span className="px-3 py-1 text-[12px] font-medium tracking-wide rounded-lg bg-[#eeebea] text-[#666666] self-start">
                          {role === 'client' ? 'Client' : 'Student'}
                        </span>
                        <form action={logout}>
                          <button type="submit" className="w-full text-left text-[15px] font-medium text-red-600 hover:text-red-700">
                            Sign Out
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-[15px] font-medium text-[#181717]">Sign In</Link>
                        <Link href="/register" className="btn-pill inline-flex justify-center">Try for free</Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <nav className="flex items-center gap-6">
              {navLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[15px] font-medium transition-colors',
                    pathname === link.href ? 'text-primary' : 'text-[#181717] hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="px-3 py-1 text-[12px] font-medium tracking-wide rounded-lg bg-[#eeebea] text-[#666666]">
                    {role === 'client' ? 'Client' : 'Student'}
                  </span>
                  <form action={logout}>
                    <button type="submit" className="text-[15px] font-medium text-[#181717] hover:text-primary">
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[15px] font-medium text-[#181717] hover:text-primary px-2">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-pill">
                    Try for free
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
