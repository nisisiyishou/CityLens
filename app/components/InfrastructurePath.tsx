import React from "react";
import Image from "next/image";


type InfraItem = {
    key: string;
    title: string;
    iconSrc: string; // grayscale placeholder (data URL or local path)
    examples: string;
};

const placeholderIcon =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23e5e7eb"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient></defs><rect width="96" height="96" rx="16" fill="url(%23g)"/><circle cx="48" cy="40" r="16" fill="%23d1d5db"/><rect x="20" y="60" width="56" height="16" rx="8" fill="%23d1d5db"/></svg>';

const infraTypes: InfraItem[] = [
    { key: "infra_restroom", title: "Public Bathroom", iconSrc: placeholderIcon, examples: "Public restrooms" },
    { key: "infra_charger", title: "Charger", iconSrc: placeholderIcon, examples: "Public charging" },
    { key: "infra_bench", title: "Bench", iconSrc: placeholderIcon, examples: "Benches" },
    { key: "infra_water", title: "Water Fountain", iconSrc: placeholderIcon, examples: "Water fountains" },
];

// Dummy icon components for demonstration
function IconToilet() {
    return <span role="img" aria-label="Toilet">🚽</span>;
}
function IconCharger() {
    return <span role="img" aria-label="Charger">🔌</span>;
}
function IconBench() {
    return <span role="img" aria-label="Bench">🪑</span>;
}
function IconWater() {
    return <span role="img" aria-label="Water">🚰</span>;
}
function CircleIcon({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-300 shadow hover:shadow-md transition"
            title={label}
            aria-label={label}
        >
            {children}
        </div>
    );
}

type NodeTypeCardProps = {
    iconSrc: string;
    title: string;
    examples: string;
};

function NodeTypeCard({ iconSrc, title, examples }: NodeTypeCardProps) {
    return (
        <div className="aspect-square flex flex-col justify-center items-center rounded-2xl border border-slate-200 p-4 bg-white shadow-sm transition hover:shadow-md text-center">
            <div className="mb-3">
                <img src={iconSrc} alt="" className="w-16 h-16 rounded-lg object-cover grayscale" />
            </div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-slate-500 mt-1">{examples}</div>
        </div>
    );
}

export default function InfrastructurePathCard() {
    return (
        <div className="relative p-4 min-h-[100vh] overflow-hidden mt-8">

            {/* Navigation bar */}
            <nav className="absolute top-0 left-0 right-0 z-20 flex justify-around items-center py-4 bg-white/80 backdrop-blur border-b border-slate-200">
            <CircleIcon label="Toilet"><IconToilet /></CircleIcon>
            <CircleIcon label="Charger"><IconCharger /></CircleIcon>
            <CircleIcon label="Bench"><IconBench /></CircleIcon>
            <CircleIcon label="Water"><IconWater /></CircleIcon>
            </nav>

            <div>

            <div className="h-16"></div>
            <div className="relative w-full h-[calc(100vh-64px)]">
             <Image
            className="dark:invert p-2 w-full h-full object-cover"
            src="/bg1.png"
            alt="Next.js logo"
            fill
            priority
            />
            </div>
            
            </div>
            
        </div>
    );
}