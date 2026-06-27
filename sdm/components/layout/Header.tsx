'use client';

import Link from 'next/link';
import { Bell, Menu, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">

        <button>
          <Menu size={22}/>
        </button>

        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
        >
          SDM
        </Link>

        <div className="flex gap-4">
          <Bell size={21}/>
          <User size={21}/>
        </div>

      </div>
    </header>
  );
}