const visionAgentUrl = process.env.VISION_AGENT_URL ?? 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callId, sessionId } = body;

    if (!callId || !sessionId) {
      return Response.json(
        { error: 'Missing callId or sessionId in request body' },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${visionAgentUrl}/calls/${callId}/sessions/${sessionId}`,
      { method: 'DELETE' },
    );

    if (!response.ok && response.status !== 202) {
      const responseText = await response.text();
      console.error('Vision Agent stop error:', response.status, responseText);
      return Response.json(
        { error: 'Failed to stop Vision Agent session', details: responseText },
        { status: response.status },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error stopping Vision Agent session:', error);
    return Response.json({ error: 'Failed to stop Vision Agent session' }, { status: 500 });
  }
}
