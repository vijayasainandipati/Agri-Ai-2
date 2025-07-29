"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // Render nothing, redirecting to login
}
