// ตัวอย่างใน src/app/page.tsx (หรือ src/app/play-dino/page.tsx ถ้า homeUrl ชี้ไปที่นั่น)
import type { Metadata } from 'next';

const appUrl = process.env.NEXT_PUBLIC_URL || "https://monadrunv1.netlify.app"; // Fallback
const gamePagePath = "/play-dino"; // Path ไปยังหน้าเกมจริง
const frameImageUrl = "https://imagizer.imageshack.com/img924/162/3FDjSU.png"; // หรือใช้รูปจาก public folder เช่น `${appUrl}/images/frame-image.png`

export const metadata: Metadata = {
  // ... (Open Graph tags อื่นๆ)
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": frameImageUrl,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "🦖 Play Monad Run!",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": `<span class="math-inline">\{appUrl\}</span>{gamePagePath}`,
    // ถ้ามี post_url ก็ใส่ที่นี่
    // "fc:frame:post_url": `${appUrl}/api/frame-action`, // ตัวอย่าง
  },
};

export default function YourPage() {
  // เนื้อหาของหน้าเว็บคุณ (เช่น หน้า Landing Page หรือหน้าเกมโดยตรง)
  return (
    <div>
      <h1>Welcome to Monad Run Game!</h1>
      <p>This page can also be a Farcaster Frame.</p>
      {/* หรือถ้า homeUrl คือหน้าเกม ก็เป็นโค้ดเกมของคุณ */}
    </div>
  );
}