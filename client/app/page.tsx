"use client";
import Image from "next/image";
import SlideShow from "./components/SlideShow";
import Articles from "./components/Articles";
import BrandSlider from "./components/BrandSlider";
import { Suspense } from "react";
import Loading from "./components/Loading";

export default function Home() {
  return (
    <>

      <main className="flex min-h-screen w-full flex-col items-center justify-between p-1">
        <Suspense fallback={<Loading />}>
          <SlideShow />
          <Articles />
          <BrandSlider />
        </Suspense>
      </main>
    </>
  );
}
