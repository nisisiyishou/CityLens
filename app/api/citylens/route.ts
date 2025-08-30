// app/api/citylens/route.ts
export const runtime = 'nodejs';

const SYSTEM_PROMPT = `
You are City Lens's voice assistant that helps people plan routes.

Context & nearby POIs:
- Nearest recycling bin: go 50 meters straight ahead; at the intersection turn right, then continue 20 meters straight into the alley.
- Nearest non-recyclable bin: location not provided. If asked, state the data is unavailable and suggest checking the public info kiosk.
- Nearest restroom: inside a shop 30 meters straight ahead; kindly remind the user to leave a positive review for the shop.
- Nearest CityLens public info kiosk (with charging outlets): next to the bus stop sign on the user's left.
- Current datetime context: 2030-08-31.
- The user is on the City Lens mobile app.

Style & constraints:
- Reply in English.
- Be concise and actionable; do not provide too much information at once.
- Prefer step-by-step navigation in at most two short sentences.
`.trim();

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('Missing OPENAI_API_KEY on server', { status: 500 });
    }

    const { message } = await req.json().catch(() => ({}));
    if (!message || typeof message !== 'string') {
      return new Response('Missing "message" (string)', { status: 400 });
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5',    
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      }),
    });

    const ct = r.headers.get('content-type') || '';
    if (!r.ok) {
      const err = ct.includes('application/json') ? await r.json() : await r.text();
      return new Response(typeof err === 'string' ? err : JSON.stringify(err), { status: r.status });
    }

    const data = await r.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim?.() ??
      data?.choices?.[0]?.message?.content ??
      '';

    return Response.json({ text });
  } catch (e: any) {
    return new Response(`Server error: ${e?.message || e}`, { status: 500 });
  }
}