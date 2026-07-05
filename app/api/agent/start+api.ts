const visionAgentUrl = process.env.VISION_AGENT_URL ?? 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callId, callType } = body;

    if (!callId) {
      return Response.json({ error: 'Missing callId in request body' }, { status: 400 });
    }

    const response = await fetch(`${visionAgentUrl}/calls/${callId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_type: callType ?? 'audio_room',
      }),
    });

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
    console.error('Error starting Vision Agent session:', error);
    return Response.json({ error: 'Failed to start Vision Agent session' }, { status: 500 });
  }
}
