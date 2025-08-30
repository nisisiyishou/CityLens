export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
    try {

        console.log(process.env)
        if (!process.env.OPENAI_API_KEY) {
            return new Response('Missing OPENAI_API_KEY on server', { status: 500 });
        }

        const form = await req.formData();
        const file = form.get('file');

        if (!file || !(file instanceof Blob)) {
            return new Response('Missing "file" in FormData', { status: 400 });
        }

        const openaiForm = new FormData();
        const filename = (file as any).name || 'audio.wav';
        openaiForm.append('file', file, filename);

        openaiForm.append('model', 'gpt-4o-transcribe');

        const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
            },
            body: openaiForm,
        });

        const ct = resp.headers.get('content-type') || '';
        if (!resp.ok) {
            const err = ct.includes('application/json') ? await resp.json() : await resp.text();
            return new Response(
                typeof err === 'string' ? err : JSON.stringify(err),
                { status: resp.status }
            );
        }

        const data = ct.includes('application/json') ? await resp.json() : { text: await resp.text() };
        const text = data?.text ?? data?.output_text ?? '';

        return Response.json({ text });
    } catch (e: any) {
        return new Response(`Server error: ${e?.message || e}`, { status: 500 });
    }
}