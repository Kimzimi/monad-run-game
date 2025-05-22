import { NextRequest, NextResponse } from 'next/server';

// 1. URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy บน Netlify
//    (ตรวจสอบให้แน่ใจว่า Path '/play-dino' ถูกต้องสำหรับหน้าเกมของคุณ)
const GAME_PAGE_URL = "https://monadrunv1.netlify.app/play-dino";

// 2. URL รูปภาพหน้าปก Frame ของคุณ
//    (นี่คือ URL จาก Imageshack ที่คุณเคยให้มา)
const FRAME_COVER_IMAGE_URL = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; 

const generateFrameHtml = (): string => {
  // สร้าง HTML string สำหรับ Frame
  // ตรวจสอบให้แน่ใจว่า meta tags ทั้งหมดถูกต้องตามมาตรฐาน Farcaster
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Tags (สำหรับ Preview ทั่วไป) */}
        <meta property="og:title" content="Monad Run - Play and Earn MON!" />
        <meta property="og:image" content="${FRAME_COVER_IMAGE_URL}" />
        
        {/* Farcaster Frame Specific Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${FRAME_COVER_IMAGE_URL}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        
        {/* Button 1 */}
        <meta property="fc:frame:button:1" content="🦖 Play Monad Run!" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" />
        
        {/* (Optional) ถ้ามีปุ่มที่ 2 หรือ input text สามารถเพิ่มได้ที่นี่ */}
        {/* <meta property="fc:frame:button:2" content="View Leaderboard" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="YOUR_LEADERBOARD_URL_HERE" />
        
        <meta property="fc:frame:input:text" content="Enter your name..." />
        */}

        <title>Monad Run Launcher Frame</title>
      </head>
      <body>
        <h1>Monad Run Farcaster Frame</h1>
        <p>Play Monad Run at: <a href="${GAME_PAGE_URL}">${GAME_PAGE_URL}</a></p>
        <p>Frame Image: <img src="${FRAME_COVER_IMAGE_URL}" alt="Frame Cover" width="400" /></p>
      </body>
    </html>
  `;
};

// Handler สำหรับ GET request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html', 
      'Cache-Control': 'public, max-age=60, s-maxage=60' // เพิ่ม s-maxage สำหรับ CDN cache
    }
  });
}

// Handler สำหรับ POST request (จำเป็นสำหรับ Frame ที่มี action "post" หรือ "post_redirect")
// สำหรับ Frame นี้ที่มีแค่ action "link", POST อาจจะไม่ถูกเรียกใช้โดยตรงจาก Farcaster client
// แต่การมีไว้ก็ไม่เสียหาย และบาง Validator อาจจะลองเรียก POST ดู
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest): Promise<Response> {
  // สำหรับ action "link", client จะไม่ส่ง POST request มาที่ Frame URL นี้
  // แต่ถ้า Frame มี input หรือปุ่ม action "post", logic จะอยู่ที่นี่
  // ในกรณีนี้ เราจะ return HTML เดิมไปก่อน
  const html = generateFrameHtml(); 
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html',
    }
  });
}