import { useRef, useCallback } from 'react';
import type { Chart } from 'chart.js';

export function useChartDownload<T extends Chart = Chart>(filename: string) {
  const chartRef = useRef<T | null>(null);

  const handleDownload = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // 元の画像を取得
    const originalImageUrl = chart.toBase64Image();

    // 新しいcanvasを作成して白い背景を描画
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 白い背景を描画
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 元の画像を描画
      ctx.drawImage(img, 0, 0);

      // 画像をダウンロード
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = originalImageUrl;
  }, [filename]);

  return { chartRef, handleDownload };
}
