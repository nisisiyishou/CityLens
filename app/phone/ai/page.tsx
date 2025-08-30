"use client"

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TypeFX from "typefxjs";
import InputWithVoice from "@/app/components/inputWithVoice";
import { speak } from "@/utils/utils";

export default function AI() {
    const content = useRef<HTMLParagraphElement | null>(null)
    const response = useRef<HTMLParagraphElement | null>(null)


    useEffect(() => {
        const timer = setTimeout(() => {
            if (content.current) {
                new TypeFX(content.current, { caretWidth: "1ch" }).type("Hello! This is the City Lens voice assistant. How can I help you today?").wait(1000).hideCaret()
                speak("Hello! This is the City Lens voice assistant. How can I help you today?", { voice: 'alloy', format: 'mp3' });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [])

    const [myText, setMyText] = useState<string>("");

    const [haveResponse, setHaveResponse] = useState<boolean>(false);





    const doSend = async (text: string) => {
        const msg = text.trim();
        if (!msg) return;

        console.log(msg);
        setMyText(msg);

        setHaveResponse(true)
        try {

            if (response.current) {

                const instance = new TypeFX(response.current, { caretWidth: "1ch" })
                    .type(".")

                let animation = () => {
                    instance.speed(300)
                        .type("...")
                        .speed(50)
                        .delete(3)
                        .wait(100)
                        .then(() => animation())
                }
                animation()

                const res = await fetch('/api/citylens', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg }),
                });
                if (!res.ok) throw new Error(await res.text());

                const { text: answer } = (await res.json()) as { text?: string };
                instance.cancel().speed(50).clear().type(answer || "ERROR").wait(1000).hideCaret()

                if (answer && answer?.trim() != "") {
                    await speak(answer, { voice: 'alloy', format: 'mp3' });
                }
            }

        } catch (err) {
            console.error('doSend failed:', err);
        }
    };



    return (
        <div className="pt-20 relative h-screen overflow-hidden">
            <div className="w-screen">
                <div className="flex justify-items-start w-screen px-6">
                    <div style={{ "fontFamily": "monospace" }} className="chatbox-ai bg-black/50 min-w-11 h-11 border rounded-full flex justify-center items-center">
                        AI
                    </div>
                    <div className="items-center flex bg-black/50 chatbox border min-h-10 min-w-15 m-2 rounded-xl p-2 pl-3 pr-4">
                        <p ref={content} style={{ "fontFamily": "monospace" }}>
                        </p>
                    </div>
                </div>

                {
                    myText != "" ? <div className="flex justify-end w-screen px-6">
                        <div className="items-center flex bg-black/50 chatbox border min-h-10 min-w-15 m-2 rounded-xl p-2 pl-3 pr-4">
                            <p>
                                {myText}
                            </p>
                        </div>
                        <div style={{ "fontFamily": "monospace" }} className="chatbox-ai bg-black/50 min-w-11 h-11 border rounded-full flex justify-center items-center">
                            YOU
                        </div>
                    </div>
                        : <></>
                }


                {
                    <div style={haveResponse ? { opacity: 1 } : { opacity: 0 }} className="flex justify-items-start w-screen px-6">
                        <div style={{ "fontFamily": "monospace" }} className="chatbox-ai bg-black/50 min-w-11 h-11 border rounded-full flex justify-center items-center">
                            AI
                        </div>
                        <div className="items-center flex bg-black/50 chatbox border min-h-10 min-w-15 m-2 rounded-xl p-2 pl-3 pr-4">
                            <p ref={response} style={{ "fontFamily": "monospace" }}>
                            </p>
                        </div>
                    </div>
                }


            </div>




            <div className="w-full absolute px-10 bottom-[21%]">
                <InputWithVoice className="" doSend={doSend} />
            </div>
        </div>
    );
}