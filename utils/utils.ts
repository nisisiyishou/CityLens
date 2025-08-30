export async function speak(text: string, opts?: { voice?: string; format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' }) {
    const body = JSON.stringify({
        text,
        voice: opts?.voice ?? 'alloy',
        format: opts?.format ?? 'mp3',
    });

    const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });
    if (!res.ok) throw new Error(await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play().catch(() => { });
    return audio;
}