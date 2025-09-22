"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';

export default function MainPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || decoded.email || 'User');
        return;
      } catch {
        router.push('/login');
        return;
      }
    }
    // If no token, check NextAuth session
    if (status === 'loading') return; // Wait for session
    if (status === 'authenticated') {
      setUserName(session.user?.name || 'User');
    } else {
      router.push('/login');
    }
  }, [router, status, session]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    signOut({ callbackUrl: '/register' });
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-[#202020] text-white flex flex-col">
      <nav className="flex justify-between items-center bg-[#1f1f1f] px-8 py-4 shadow-md">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
          GraphicWeb
        </div>
        <div className="space-x-4">
          <button
            onClick={goToProfile}
            className="bg-[#3a3a3a] px-4 py-2 rounded hover:bg-[#555]"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#aa2222] px-4 py-2 rounded hover:bg-[#cc4444]"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-grow flex justify-center items-center">
        <h1 className="text-3xl font-semibold">
          Hi {userName}, Welcome to Graphic Web
        </h1>
      </main>
    </div>
  );
}
