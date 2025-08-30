import React from "react";
import Image from "next/image";

export default function CommingSoon() {
  return (
    <div className="mt-20 relative h-screen overflow-hidden">
      <div className="container mx-auto px-4 pt-16">
        <h1 className="reveal text-4xl font-semibold my-6"
          style={{ ["--delay" as any]: "0ms" }}>Comming Soon</h1>
      </div>

    </div>
  );
}