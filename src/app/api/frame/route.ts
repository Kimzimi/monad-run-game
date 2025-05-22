// src/app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ==================================================================================
// START: ค่าที่คุณอาจจะต้องตรวจสอบหรือแก้ไขอีกครั้ง (ถ้ามีการเปลี่ยนแปลง)
// ==================================================================================

// 1. URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy
const GAME_PAGE_URL = "https://monadrunv1.netlify.app/play-dino";

// 2. URL รูปภาพหน้าปก Frame ของคุณ
const FRAME_COVER_IMAGE_URL = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; 

// ==================================================================================
// END: ค่าที่คุณอาจจะต้องตรวจสอบหรือแก้ไข
// ==================================================================================

const generateFrameHtml = (): string => {
  // ตรวจสอบว่า URL ต่างๆ ไม่ใช่ค่าว่างหรือ placeholder เริ่มต้น (เผื่อกรณีคัดลอกไปแล้วลืมแก้)
  if (!GAME_PAGE_URL || GAME_PAGE_URL.includes("YOUR_") || GAME_PAGE_URL.includes("EXAMPLE")) {
    console.error("CRITICAL ERROR: GAME_PAGE_URL is not set correctly in src/app/api/frame/route.ts. Please update it with your deployed game page URL.");
    // คืนค่า HTML ที่แสดง Error ให้ชัดเจนบน Frame
    return `
      <!DOCTYPE html><html><head><title>Frame Configuration Error</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://placehold.co/800x418/red/white?text=Error:+Game+URL+Not+Set" />
      <meta property="fc:frame:button:1" content="Configuration Error" />
      </head><body>Error: Game Page URL is not configured.</body></html>
    `;
  }

  if (!FRAME_COVER_IMAGE_URL || FRAME_COVER_IMAGE_URL.includes("YOUR_") || FRAME_COVER_IMAGE_URL.includes("EXAMPLE_IMAGE_URL")) {
    console.error("CRITICAL ERROR: FRAME_COVER_IMAGE_URL is not set correctly in src/app/api/frame/route.ts. Please update it with your frame cover image URL.");
    // คืนค่า HTML ที่แสดง Error ให้ชัดเจนบน Frame (แต่ยังคงมีปุ่มไปหน้าเกม)
    return `
      <!DOCTYPE html><html><head><title>Frame Configuration Error</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://placehold.co/800x418/orange/white?text=Error:+Frame+Image+Not+Set" />
      <meta property="fc:frame:button:1" content="Play Game (Image Missing)" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" />
      </head><body>Error: Frame Cover Image URL is not configured.</body></html>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
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
        
        <title>Monad Run Launcher Frame</title>
      </head>
      <body>
        <h1>Monad Run Farcaster Frame</h1>
        <p>If you are not redirected, <a href="${GAME_PAGE_URL}">click here to play Monad Run!</a></p>
        <p>Frame Image URL: ${FRAME_COVER_IMAGE_URL}</p>
      </body>
    </html>
  `;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html', 
      'Cache-Control': 'public, max-age=60, s-maxage=60'
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml(); 
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html',
    }
  });
}