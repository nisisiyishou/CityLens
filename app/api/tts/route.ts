// app/api/tts/route.ts
export const runtime = 'nodejs';

type TTSBody = {
    text: string;
    voice?: string;
    format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav';
    model?: string;
};

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return new Response('Missing OPENAI_API_KEY on server', { status: 500 });
        }

        const { text, voice = 'alloy', format = 'mp3', model = 'gpt-4o-mini-tts' } =
            (await req.json()) as TTSBody;

        if (!text || typeof text !== 'string') {
            return new Response('Missing "text" (string)', { status: 400 });
        }

        // OpenAI Text-to-Speech
        const r = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                voice,
                input: text,
                format,
            }),
        });

        if (!r.ok) {
            const errText = await r.text();
            return new Response(errText, { status: r.status });
        }

        const ct = r.headers.get('content-type') || (
            format === 'mp3' ? 'audio/mpeg'
                : format === 'opus' ? 'audio/ogg; codecs=opus'
                    : format === 'aac' ? 'audio/aac'
                        : format === 'flac' ? 'audio/flac'
                            : 'audio/wav'
        );

        return new Response(r.body, {
            headers: {
                'Content-Type': ct,
                'Cache-Control': 'no-store',
            },
        });
    } catch (e: any) {
        return new Response(`Server error: ${e?.message || e}`, { status: 500 });
    }
}