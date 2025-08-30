import React from "react";
import Image from "next/image";

export default function CommingSoon() {
  return (
    <div className="h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-5 pt-16 bg-gradient-to-b from-emerald-900/70 to-transparent w-screen">
        <h1 className="reveal text-4xl font-semibold my-6"
          style={{ ["--delay" as any]: "0ms" }}>Comming Soon ...</h1>
        <p className="reveal text mb-1 opacity-90 max-w-3xl"
          style={{ ["--delay" as any]: "70ms" }}>
          We are Banana Overloads of Chaos!
        </p>
      </div>
    </div>
  );
}