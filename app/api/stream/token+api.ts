import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Missing Stream API Key or Secret in .env");
}

// Initialize the Stream backend client (never exposed to frontend)
const client = apiKey && apiSecret ? new StreamClient(apiKey, apiSecret) : null;

export async function POST(req: Request) {
  try {
    if (!client) {
      return Response.json({ error: 'Stream client not configured properly on server' }, { status: 500 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: 'Missing userId in request body' }, { status: 400 });
    }

    // Generate token valid for 1 hour
    const token = client.generateUserToken({ user_id: userId, validity_in_seconds: 3600 });

    return Response.json({ token });
  } catch (error) {
    console.error('Error generating stream token:', error);
    return Response.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
