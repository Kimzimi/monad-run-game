// src/app/providers.tsx
"use client";

import React from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../lib/wagmiConfig'; // ใช้ Relative Path
// VVVVVV เพิ่ม Import สำหรับ React Query VVVVVV
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ^^^^^^ สิ้นสุดการเพิ่ม Import ^^^^^^

// สร้าง QueryClient instance (ทำนอก component เพื่อไม่ให้สร้างใหม่ทุก render)
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* VVVVVV ห่อด้วย QueryClientProvider VVVVVV */}
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      {/* ^^^^^^ สิ้นสุดการห่อ ^^^^^^ */}
    </WagmiConfig>
  );
}
