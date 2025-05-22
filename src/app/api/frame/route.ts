import { NextRequest, NextResponse } from 'next/server';

const GAME_PAGE_URL = "https://monadrunv1.netlify.app/play-dino";
const FRAME_COVER_IMAGE_URL = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; 

const generateFrameHtml = (): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Monad Run - Play and Earn MON!" />
        <meta property="og:image" content="${FRAME_COVER_IMAGE_URL}" />
        <meta property="og:type" content="website" /> 
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