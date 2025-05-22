import { NextRequest, NextResponse } from 'next/server';

// 1. URL เต็มของหน้าเกม Monad Run ของคุณที่ Deploy
const GAME_PAGE_URL = "https://monadrunv1.netlify.app/play-dino";

// 2. URL รูปภาพหน้าปก Frame ของคุณ
const FRAME_COVER_IMAGE_URL = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; 

// ฟังก์ชันสร้าง HTML สำหรับ Frame
const generateFrameHtml = (): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Essential Open Graph Tags (สำหรับ Preview ทั่วไป) */}
        <meta property="og:title" content="Monad Run - Play and Earn MON!" />
        <meta property="og:image" content="${FRAME_COVER_IMAGE_URL}" />
        <meta property="og:type" content="website" /> 
        {/* คุณอาจจะใส่ og:description ด้วยก็ได้ */}
        {/* <meta property="og:description" content="Play the exciting Monad Run game and earn rewards!" /> */}

        {/* Farcaster Frame Specific Tags - ตรวจสอบความถูกต้องตามสเปคล่าสุด */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${FRAME_COVER_IMAGE_URL}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" /> 
        
        {/* Button 1: พาไปยังหน้าเกม */}
        <meta property="fc:frame:button:1" content="🦖 Play Monad Run!" />
        <meta property="fc:frame:button:1:action" content="link" /> 
        <meta property="fc:frame:button:1:target" content="${GAME_PAGE_URL}" />
        
        {/* (Optional) ถ้าคุณต้องการ Post URL สำหรับ analytics หรือ action อื่นๆ */}
        {/* <meta property="fc:frame:post_url" content="YOUR_POST_URL_HERE_IF_NEEDED" /> */}

        {/* (Optional) ถ้ามี Input Text */}
        {/* <meta property="fc:frame:input:text" content="Enter your name..." /> */}
        
        <title>Monad Run Launcher Frame</title>
      </head>
      <body>
        <h1>Monad Run Farcaster Frame</h1>
        <p>This is a Farcaster Frame. If you are seeing this page directly, you are likely viewing the frame's source URL.</p>
        <p>Click the button in a Farcaster client to play Monad Run at: <a href="${GAME_PAGE_URL}">${GAME_PAGE_URL}</a></p>
        <p>Frame Image: <img src="${FRAME_COVER_IMAGE_URL}" alt="Frame Cover" style="max-width: 400px;" /></p>
      </body>
    </html>
  `;
};

// Handler สำหรับ GET request (สำคัญที่สุดสำหรับ Frame ที่มี action "link")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest): Promise<Response> {
  const html = generateFrameHtml();
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html', 
      // Cache-Control ที่เหมาะสม: ไม่ cache นานเกินไปถ้ามีการเปลี่ยนแปลงบ่อย
      // หรือถ้าไม่เปลี่ยนแปลงเลย ก็ cache ได้นานขึ้น
      'Cache-Control': 'public, max-age=60, s-maxage=60' // Cache 1 นาที
    }
  });
}

// Handler สำหรับ POST request (จำเป็นสำหรับ Frame ที่มีปุ่ม action "post" หรือ "post_redirect", หรือมี input)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest): Promise<Response> {
  // สำหรับ Frame ปัจจุบันที่มีแค่ action "link", ส่วนนี้อาจจะไม่ถูกเรียกใช้โดยตรง
  // แต่การมีไว้ก็ไม่เสียหาย และถ้าอนาคตเพิ่มปุ่ม POST ก็สามารถมาแก้ไข logic ตรงนี้ได้
  // ในที่นี้ เราจะ return HTML ของ Frame เดิมไปก่อน
  const html = generateFrameHtml(); 
  return new NextResponse(html, { 
    status: 200, 
    headers: { 
      'Content-Type': 'text/html',
    }
  });
}