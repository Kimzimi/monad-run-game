// src/app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

// URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy บน Vercel
const GAME_PAGE_URL = "https://monad-run-game-v3-7d75cfw00-kimzimis-projects.vercel.app/play-dino";

// <<! สำคัญมาก: แก้ไข YOUR_FRAME_COVER_IMAGE_URL_HERE !>>
// URL รูปภาพหน้าปก Frame (อัปโหลดไป Imgur หรือใส่ใน public folder ของ Vercel)
// เช่น "https://monad-run-game-v3-7d75cfw00-kimzimis-projects.vercel.app/monad-run-cover.png"
// หรือใช้ Placeholder เริ่มต้น: "https://placehold.co/800x418/7037C2/FFFFFF?text=Monad+Run"
const FRAME_COVER_IMAGE_URL = "YOUR_FRAME_COVER_IMAGE_URL_HERE"; 
// ถ้ายังไม่มีรูป ให้ใช้ placeholder นี้ไปก่อนได้ครับ:
// const FRAME_COVER_IMAGE_URL = "https://placehold.co/800x418/7037C2/FFFFFF?text=Monad+Run";


const generateFrameHtml = (): string => {
  if (FRAME_COVER_IMAGE_URL === "YOUR_FRAME_COVER_IMAGE_URL_HERE") {
    // Fallback ในกรณีที่ URL รูปภาพยังไม่ได้ถูกแก้ไข
    console.error("ERROR: FRAME_COVER_IMAGE_URL has not been set in src/app/api/frame/route.ts. Using default GAME_PAGE_URL.");
    return `<!DOCTYPE html><html><head><title>Configuration Error</title><meta property="fc:frame" content="vNext" /><meta property="fc:frame:image" content="https://placehold.co/800x418/orange/white?text=Error:+Frame+Image+URL+Needed" /><meta property="fc:frame:button:1" content="Play Game" /><meta property="fc:frame:button:1:action" content="link" /><meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" /></head><body>Configuration Error: Please set the FRAME_COVER_IMAGE_URL in the API route.</body></html>`;
  }
  return `
    <!DOCTYPE html><html><head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Monad Run - Play and Earn MON!" />
      <meta property="og:image" content="${FRAME_COVER_IMAGE_URL}" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${FRAME_COVER_IMAGE_URL}" />
      <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
      <meta property="fc:frame:button:1" content="🦖 Play Monad Run!" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" />
      <title>Monad Run Launcher</title>
    </head><body>Play Monad Run at ${GAME_PAGE_URL}</body></html>
  `;
};

export async function GET(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html', 
      'Cache-Control': 'public, max-age=60' // Cache สำหรับ 60 วินาที
    }
  });
}

export async function POST(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html' 
    }
  });
}