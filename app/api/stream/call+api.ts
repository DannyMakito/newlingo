import { StreamClient } from '@stream-io/node-sdk';
import {
  AI_TEACHER_USER_ID,
  buildLessonCallCustomData,
} from '@/lib/lessonCallData';

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Missing Stream API Key or Secret in .env");
}

// Initialize the Stream backend client
const client = apiKey && apiSecret ? new StreamClient(apiKey, apiSecret) : null;

export async function POST(req: Request) {
  try {
    if (!client) {
      return Response.json({ error: 'Stream client not configured properly on server' }, { status: 500 });
    }

    const body = await req.json();
    const { userId, lessonId, languageId } = body;

    if (!userId || !lessonId) {
      return Response.json({ error: 'Missing userId or lessonId in request body' }, { status: 400 });
    }

    const callId = `lesson-${lessonId}`;
    const call = client.video.call('audio_room', callId);
    const lessonCustomData = buildLessonCallCustomData(lessonId, languageId || 'unknown');

    // Create the call server-side, attaching relevant data
    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: 'admin' },
          { user_id: AI_TEACHER_USER_ID, role: 'admin' },
        ],
        custom: lessonCustomData,
      },
    });

    return Response.json({ success: true, callId });
  } catch (error) {
    console.error('Error creating stream call:', error);
    return Response.json({ error: 'Failed to create call' }, { status: 500 });
  }
}
