"use client";
import { Header } from "@/components/header";
import { MatterBackground } from "@/components/MatterBackground";

export default function Test() {
  return (
    <div className="relative min-h-screen">
      <MatterBackground circleCount={60} />
      <div className="relative z-10">
        <Header />
      </div>
    </div>
  );
}
