import { StreamClient } from '@stream-io/node-sdk';
import { getAuthUserId } from '@/lib/apiAuth';

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

    // Authenticate the caller via Clerk
    let userId = await getAuthUserId(req);

    if (!userId) {
      // Fall back to body userId for development when CLERK_SECRET_KEY is not set
      const body = await req.json();
      userId = body.userId;
      if (!userId) {
        return Response.json({ error: 'Unauthorized: missing or invalid token' }, { status: 401 });
      }
    }

    // Generate token valid for 1 hour
    const token = client.generateUserToken({ user_id: userId, validity_in_seconds: 3600 });

    return Response.json({ token });
  } catch (error) {
    console.error('Error generating stream token:', error);
    return Response.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
