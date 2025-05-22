// src/app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

// URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy บน Vercel
const GAME_PAGE_URL = "https://monad-run-game-v3-7d75cfw00-kimzimis-projects.vercel.app/play-dino";

// URL รูปภาพหน้าปก Frame (จาก Imageshack ที่คุณให้มา)
const FRAME_COVER_IMAGE_URL = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; 


const generateFrameHtml = (): string => {
  // ไม่จำเป็นต้องเช็ค YOUR_FRAME_COVER_IMAGE_URL_HERE อีกต่อไป เพราะเราใส่ URL จริงแล้ว
  // แต่ GAME_PAGE_URL ยังควรตรวจสอบ (เผื่อมีการเปลี่ยนแปลงในอนาคต)
  if (GAME_PAGE_URL === "YOUR_DEPLOYED_GAME_PAGE_URL_HERE") { // ตรวจสอบเผื่อกรณีนี้ยังไม่ได้ถูกแก้ไข
    console.error("ERROR: GAME_PAGE_URL has not been set correctly in src/app/api/frame/route.ts.");
    return `<!DOCTYPE html><html><head><title>Configuration Error</title><meta property="fc:frame" content="vNext" /><meta property="fc:frame:image" content="https://placehold.co/800x418/orange/white?text=Error:+Game+URL+Needed" /><meta property="fc:frame:button:1" content="Error" /></head><body>Configuration Error: Please set the GAME_PAGE_URL.</body></html>`;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html', 
      'Cache-Control': 'public, max-age=60'
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html' 
    }
  });
}