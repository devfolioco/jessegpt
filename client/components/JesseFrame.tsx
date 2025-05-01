import { nyghtMedium } from '@/app/fonts/fonts';
import { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface JesseFrameProps {
  idea: string;
}

const frameWidth = 650;
const frameHeight = 340;
const MAX_IDEA_WIDTH = 350;

function resizeCanvas(canvas: HTMLCanvasElement) {
  const { width, height } = canvas.getBoundingClientRect();

  const { devicePixelRatio: ratio = 1 } = window;
  const context = canvas.getContext('2d');

  if (!context) return;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);
}

const drawRoughEllipse = (
  canvasElement: HTMLCanvasElement,
  width: number,
  height: number,
  {
    ideaTextWidth,
  }: {
    ideaTextWidth: number;
  }
) => {
  // Draw the concentric ellipses

  const rc = rough.canvas(canvasElement);
  const centerX = width / 2;
  const centerY = height / 3 + 105; // Adjust to center around "MailSprint"
  const ellipseWidth = ideaTextWidth + 60;
  const ellipseHeight = 100;

  const jitter = 10;
  const roughness = 0.5;

  rc.ellipse(centerX, centerY, ellipseWidth, ellipseHeight - 20, {
    stroke: '#0061F2',
    strokeWidth: 4,
    roughness,
    // bowing: 100,
  });
  rc.ellipse(centerX + jitter, centerY, ellipseWidth, ellipseHeight - 20, {
    stroke: '#0061F2',
    strokeWidth: 4,
    roughness,
  });
  rc.ellipse(centerX - jitter, centerY + 4, ellipseWidth, ellipseHeight - 20, {
    stroke: '#0061F2',
    strokeWidth: 4,
    roughness,
  });
};

const drawFrame = (canvasElement: HTMLCanvasElement, width: number, height: number, idea: string) => {
  // Resize the canvas for the display resolution
  resizeCanvas(canvasElement);

  const ctx = canvasElement.getContext('2d');

  if (!ctx) return;

  var background = new Image();
  background.src = '/frame/dot-grid.svg';

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    ctx.drawImage(background, 6, 4);
  };

  // Set background color
  ctx.fillStyle = '#638596';
  ctx.fillRect(0, 0, width, height);

  // Set up text styling
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF'; // Set text color to white

  // Draw "Base"
  ctx.font = `bold 50px ${nyghtMedium.style.fontFamily}`;
  ctx.fillText('Base', width / 2, height / 3 - 20);

  // Draw "is for"
  // Font is inherited from previous fillText, no need to reset unless different
  ctx.fillText('is for', width / 2, height / 3 + 40);

  //   default font size
  ctx.font = `bold 50px ${nyghtMedium.style.fontFamily}`;
  const expectedIdeaTextWidth = ctx.measureText(idea).width;

  const scaleDownRatio = expectedIdeaTextWidth > MAX_IDEA_WIDTH ? MAX_IDEA_WIDTH / expectedIdeaTextWidth : 1;

  const ideaFontSize = 50 * scaleDownRatio;
  // todo: add logic to break line, first instead of scaling down

  ctx.font = `bold ${ideaFontSize}px ${nyghtMedium.style.fontFamily}`;

  const ideaTextWidth = ctx.measureText(idea).width;

  // Draw idea name
  ctx.font = `bold ${ideaFontSize}px ${nyghtMedium.style.fontFamily}`;

  ctx.fillText(idea, width / 2, height / 3 + (120 - (1 - scaleDownRatio) * 14));

  // Load and draw the jesse image
  const jesseImage = new Image();
  jesseImage.onload = () => {
    // Draw the image in the bottom left corner
    const imageSize = 114;
    ctx.drawImage(jesseImage, 32, frameHeight - imageSize, imageSize, imageSize);
  };
  jesseImage.src = '/frame/jesse-t.png';

  // Draw the rough ellipse
  drawRoughEllipse(canvasElement, frameWidth, frameHeight, { ideaTextWidth });
};

const JesseFrame = ({ idea }: JesseFrameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    if (canvasRef.current) {
      // Create a temporary link element
      const link = document.createElement('a');
      // Set the download name
      link.download = 'base-is-for-mailsprint.png';
      // Convert canvas to data URL
      link.href = canvasRef.current.toDataURL('image/png');
      // Append to document (required for Firefox)
      document.body.appendChild(link);
      // Trigger the download
      link.click();
      // Clean up
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for CMD+. (Mac) or CTRL+. (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        handleDownload();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      drawFrame(canvasRef.current, frameWidth, frameHeight, idea);
    }

    return () => {
      if (canvasRef.current) {
        // Clear the canvas when component unmounts
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };
  }, [idea]);

  return (
    <canvas
      ref={canvasRef}
      width={frameWidth}
      height={frameHeight}
      // this is important to load the font family, before canvas is drawn
      className={`w-full h-full ${nyghtMedium.className}`}
      style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
    ></canvas>
  );
};

export const PrefetchJesseFrameAssets = () => {
  return (
    <>
      <link rel="prefetch" href="/frame/dot-grid.svg" as="image" type="image/svg+xml" />
      <link rel="prefetch" href="/frame/jesse-t.png" as="image" type="image/png" />
    </>
  );
};

export default JesseFrame;
