// src/app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

// <<! 1. แก้ไข YOUR_DEPLOYED_GAME_PAGE_URL !>>
// นี่คือ URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy บน Vercel
// เช่น "https://your-app-name.vercel.app/play" (ถ้าหน้าเกมอยู่ที่ /play)
const GAME_PAGE_URL = "YOUR_DEPLOYED_GAME_PAGE_URL_HERE";

// <<! 2. แก้ไข YOUR_FRAME_COVER_IMAGE_URL !>>
// URL รูปภาพหน้าปก Frame (อัปโหลดไป Imgur หรือใส่ใน public folder ของ Vercel)
// เช่น "https://your-app-name.vercel.app/monad-run-cover.png" (ถ้าคุณมีรูปนี้ใน public/images/ หรือ public/ โดยตรง)
// หรือใช้ Placeholder: "https://placehold.co/800x418/7037C2/FFFFFF?text=Monad+Run"
const FRAME_COVER_IMAGE_URL = "https://pic.in.th/image/dino-run.Su8BpP";


const generateFrameHtml = () => {
  if (GAME_PAGE_URL === "https://monad-run-game-v3-7d75cfw00-kimzimis-projects.vercel.app/" || FRAME_COVER_IMAGE_URL === "YOUR_FRAME_COVER_IMAGE_URL_HERE") {
    // Fallback ในกรณีที่ URL ยังไม่ได้ถูกแก้ไข
    return `<!DOCTYPE html><html><head><title>Config Error</title><meta property="fc:frame" content="vNext" /><meta property="fc:frame:image" content="https://placehold.co/800x418/orange/white?text=Error:+App+URL+Not+Set+in+Frame+API" /><meta property="fc:frame:button:1" content="Error" /></head><body>Config Error</body></html>`;
  }
  return `
    <!DOCTYPE html><html><head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Monad Run - Play and Earn MON!" />
      <meta property="og:image" content="<span class="math-inline">\{FRAME\_COVER\_IMAGE\_URL\}" /\>
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="{FRAME_COVER_IMAGE_URL}" />
<meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
<meta property="fc:frame:button:1" content="🦖 Play Monad Run!" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" />
<title>Monad Run Launcher</title>
</head><body>Play Monad Run at ${GAME_PAGE_URL}</body></html>
`;
};

export async function GET(req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=60' }});
}

export async function POST(req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html' }});
}