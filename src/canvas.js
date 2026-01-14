"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store";
import { renderElements } from "@/renderer";

export default function Canvas({ pdfUrl }) {
  const canvasRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const fabricRef = useRef(null);
  const fabricModuleRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [pdfSize, setPdfSize] = useState({ width: 1000, height: 1414 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Get elements from store
  const elements = useEditorStore((state) => state.elements);

  // Initialize Fabric Canvas
  useEffect(() => {
    let mounted = true;
    let canvas = null;

    const initCanvas = async () => {
      if (fabricModuleRef.current) return;

      try {
        const fabricModule = await import("fabric");

        if (! mounted || !canvasRef.current) return;

        if (canvasRef.current.__fabric) {
          canvasRef.current.__fabric.dispose();
        }

        canvas = new fabricModule.Canvas(canvasRef.current, {
          width: pdfSize.width,
          height: pdfSize.height,
          backgroundColor: "transparent",
        });

        fabricModuleRef.current = fabricModule; // Store the module
        fabricRef.current = canvas;

        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    };

    initCanvas();

    return () => {
      mounted = false;
      if (canvas) {
        canvas.dispose();
      }
      fabricRef.current = null;
    };
  }, []);

  // Update canvas size
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setDimensions({
        width: pdfSize. width,
        height: pdfSize.height,
      });
    }
  }, [pdfSize]);

  // Render elements when they change or page changes
  useEffect(() => {
    if (fabricRef.current && fabricModuleRef.current && elements.length > 0 && isReady) {
      console.log('Rendering elements:', elements. length);
      renderElements(elements, currentPage, fabricRef.current, fabricModuleRef.current);
    }
  }, [elements, currentPage, isReady]);

  // Load PDF
  useEffect(() => {
    if (!pdfUrl || !pdfCanvasRef.current) return;

    let mounted = true;

    const loadPdf = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.mjs";

        const loadingTask = pdfjsLib. getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (!mounted) return;

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(currentPage);
        if (! mounted) return;

        const canvas = pdfCanvasRef.current;
        const context = canvas. getContext("2d");

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas. width = viewport.width;

        setPdfSize({ width: viewport.width, height: viewport.height });

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();

    return () => {
      mounted = false;
    };
  }, [pdfUrl, currentPage]);

  const handlePageChange = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-white border-b">
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <label htmlFor="pageNumber" className="font-medium">
          Page: 
        </label>
        <input
          id="pageNumber"
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={handlePageChange}
          className="w-16 px-2 py-1 border rounded"
        />
        <span className="text-gray-600">/ {totalPages}</span>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      <div className="flex items-center justify-center h-full bg-gray-100 overflow-auto p-4">
        {! isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p>Loading canvas...</p>
          </div>
        )}

        <div style={{ position: "relative" }}>
          <canvas
            ref={pdfCanvasRef}
            style={{
              position:  "absolute",
              top: 0,
              left: 0,
              opacity: 0.5,
              pointerEvents: "none",
            }}
            className="shadow-lg"
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            className="shadow-lg"
          />
        </div>
      </div>
    </>
  );
}