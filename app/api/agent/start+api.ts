import { getAuthUserId } from '@/lib/apiAuth';

const visionAgentUrl = process.env.VISION_AGENT_URL ?? 'http://localhost:8000';
const AGENT_FETCH_TIMEOUT_MS = 30000;

export async function POST(req: Request) {
  try {
    // Authenticate the caller via Clerk (best-effort; skipped when CLERK_SECRET_KEY is missing)
    const userId = await getAuthUserId(req);

    const body = await req.json();
    const { callId, callType } = body;

    if (!callId) {
      return Response.json({ error: 'Missing callId in request body' }, { status: 400 });
    }

    // If auth is configured but verification failed, reject
    if (!userId && process.env.CLERK_SECRET_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use AbortController for timeout on the outbound Vision Agent request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AGENT_FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(`${visionAgentUrl}/calls/${callId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_type: callType ?? 'audio_room',
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const responseText = await response.text();
    let data: Record<string, unknown> = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText) as Record<string, unknown>;
      } catch {
        data = { message: responseText };
      }
    }

    if (!response.ok) {
      console.error('Vision Agent start error:', response.status, data);
      return Response.json(
        { error: 'Failed to start Vision Agent session', details: data },
        { status: response.status },
      );
    }

    return Response.json({
      sessionId: data.session_id ?? data.sessionId ?? null,
      status: data.status ?? 'started',
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.error('Vision Agent request timed out');
      return Response.json({ error: 'Vision Agent request timed out' }, { status: 504 });
    }
    console.error('Error starting Vision Agent session:', error);
    return Response.json({ error: 'Failed to start Vision Agent session' }, { status: 500 });
  }
}
