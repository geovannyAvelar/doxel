import { useState } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import Canvas from "@/canvas";
import PdfLoader from "@/pdfLoader";
import ConfigLoader from "@/configLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState("/test.pdf");

  const handlePdfLoad = (url) => {
    setPdfUrl(url);
  };

  return (
    <>
      <Head>
        <title>Doxel</title>
        <meta name="description" content="Doxel template WYSIWYG editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <PdfLoader onPdfLoad={handlePdfLoad} />
          <ConfigLoader />
        </div>

        <main>
          <Canvas pdfUrl={pdfUrl} />
        </main>
      </div>
    </>
  );
}
