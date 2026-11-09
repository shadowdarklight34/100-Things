import { Statement } from '../data/statements';

export async function downloadStoryCard(statement: Statement, recipientName: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
  bgGrad.addColorStop(0, '#1c152a');
  bgGrad.addColorStop(0.5, '#0d0a15');
  bgGrad.addColorStop(1, '#040307');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Subtle golden stardust particles
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1080;
    const y = Math.random() * 1920;
    const r = Math.random() * 2.2 + 0.5;
    const alpha = Math.random() * 0.7 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(247, 211, 130, ${alpha})`;
    ctx.fill();
  }

  // Elegant golden border
  ctx.strokeStyle = 'rgba(247, 211, 130, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 960, 1800);

  // Inner border
  ctx.strokeStyle = 'rgba(247, 211, 130, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(74, 74, 932, 1772);

  // Corner ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.strokeStyle = '#f7d382';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.stroke();
  };
  drawCorner(60, 60);
  drawCorner(1020, 60);
  drawCorner(60, 1860);
  drawCorner(1020, 1860);

  // Header Title
  ctx.textAlign = 'center';
  ctx.font = '500 42px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillStyle = '#f7d382';
  ctx.shadowColor = 'rgba(247, 211, 130, 0.6)';
  ctx.shadowBlur = 18;
  const titleText = `100 THINGS ABOUT ${recipientName.toUpperCase()}`;
  ctx.fillText(titleText, 540, 360);

  // Top divider line
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(247, 211, 130, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(340, 420);
  ctx.lineTo(740, 420);
  ctx.stroke();

  // Number badge
  const numStr = String(statement.id).padStart(3, '0');
  ctx.font = '600 32px "Cormorant Garamond", serif';
  ctx.fillStyle = '#f7d382';
  ctx.fillText(`—  ${numStr[0]}  ${numStr[1]}  ${numStr[2]}  —`, 540, 720);

  // Draw Statement Text
  const plainText = statement.raw.replace(/\*/g, '');

  ctx.font = '400 58px "Cormorant Garamond", serif';
  ctx.fillStyle = '#f3efe6';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 15;

  // Simple word wrapping
  const words = plainText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 780 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const startY = 960 - (lines.length * 80) / 2;
  lines.forEach((line, idx) => {
    // Check if line contains highlighted words from parts
    ctx.fillText(line, 540, startY + idx * 85);
  });

  // Bottom divider line
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(247, 211, 130, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(380, 1280);
  ctx.lineTo(700, 1280);
  ctx.stroke();

  // Footer watermark
  ctx.font = '300 28px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(247, 211, 130, 0.65)';
  ctx.fillText('✨ A Tribute of Admiration & Wonder', 540, 1680);

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `100_things_reason_${numStr}.png`;
  a.click();
}
