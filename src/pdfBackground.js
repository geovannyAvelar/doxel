'use client';

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `pdf.worker.min.mjs`;

export default function PdfBackground({ pdfUrl, page = 1, onPageRendered }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {
    if (!pdfUrl) return;

    pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
      setPdfDoc(pdf);
    });
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    pdfDoc.getPage(page).then((pdfPage) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const viewport = pdfPage.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      pdfPage.render(renderContext).promise.then(() => {
        if (onPageRendered) {
          onPageRendered({ width: viewport.width, height: viewport.height });
        }
      });
    });
  }, [pdfDoc, page]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0,
        pointerEvents: 'none',
        opacity: 0.3
      }}
    />
  );
}