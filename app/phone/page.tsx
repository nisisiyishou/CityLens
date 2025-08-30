"use client"

// app/page.tsx  (JS 也可，按需改扩展名)
import Image from "next/image";
import "./index.css";
import { useEffect, useState } from "react";

function IconMenu() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IconDining() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M7 3v10M11 3v10M7 13h4M17 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IconTee() {
    return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <path d="M12 3a4 4 0 0 1 4 4c0 2.761-4 6-4 6s-4-3.239-4-6a4 4 0 0 1 4-4z" fill="currentColor" />
            <path d="M12 13v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IconCalendar() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IconMembers() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4M12 20a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function Home() {

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatted = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });


    const [activeIndex, setActiveIndex] = useState(2);

    const buttons = [
        { icon: <IconMembers /> },
        { icon: <IconDining /> },
        { icon: <IconTee /> },
        { icon: <IconCalendar /> },
        { icon: <IconMembers /> },
    ];


    return (
        <main className="min-h-screen grid place-items-center bg-neutral-600 font-sans text-white">
            <Image
                src="/sydney-bridge.jpg"
                alt="background"
                fill
                priority
                className="object-cover"
            />



            {/* <div className="absolute inset-0 bg-emerald-900/40" /> */}

            <div className="absolute inset-0 bg-emerald-900/25" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-transparent to-transparent" />



            <section className="flex flex-col items-center absolute left-0 right-0 px-6" style={{ top: "5%" }}>
            </section>

            {/* 42 */}
            <section className="flex flex-col items-center absolute left-0 right-0 px-6" style={{ top: "35%" }}>

                <p className="reveal mt-3 text-xs tracking-widest uppercase opacity-80"
                    style={{ ["--delay" as any]: "0ms" }}
                > {formatted}</p>

                <h1 className="reveal mt-3 text-3xl"
                    style={{ ["--delay" as any]: "200ms" }}
                >Sydney City Lens</h1>

                <button
                    className="reveal display-button mt-6 inline-flex justify-center items-center gap-2 px-3 py-1 text-xs tracking-[0.25em] uppercase backdrop-blur-sm"
                    style={{ ["--delay" as any]: "300ms" }}
                >
                    Urban Green Trail
                </button>

                <button
                    className="reveal display-button mt-6 inline-flex justify-center items-center gap-2 px-3 py-1 text-xs tracking-[0.25em] uppercase backdrop-blur-sm"
                    style={{ ["--delay" as any]: "400ms" }}
                >
                    Forgotten Stories Line
                </button>

                <button
                    className="reveal display-button mt-6 inline-flex justify-center items-center gap-2 px-3 py-1 text-xs tracking-[0.25em] uppercase backdrop-blur-sm"
                    style={{ ["--delay" as any]: "500ms" }}
                >
                    Infractructure Path
                </button>
            </section>

            <footer className="absolute inset-x-0 bottom-0 overflow-hidden">
                <div className="absolute -inset-x-6 bottom-0 top-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/40 to-transparent" />

                <div className="reveal relative px-6 pb-3"
                    style={{ ["--delay" as any]: "600ms" }}
                >
                    <div className="mt-3 flex items-center justify-center gap-2">
                        {buttons.map((btn, i) => {
                            const distance = Math.abs(i - activeIndex);

                            let zoom = 1 - distance * 0.15;
                            if (zoom < 0.7) zoom = 0.7;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    style={{ ["--zoom" as any]: zoom }}
                                    className={`main-button ${i === activeIndex ? "active" : ""}`}
                                >
                                    {btn.icon}
                                </div>
                            );
                        })}
                    </div>


                    <p className="mt-2 text-center text-xs text-gray-300">Urban Green Trail</p>

                    <p className="mt-5 text-center text-[10px] tracking-[0.35em] uppercase text-white/30">
                        Explore the city
                    </p>
                </div>
            </footer>
        </main>
    );
}