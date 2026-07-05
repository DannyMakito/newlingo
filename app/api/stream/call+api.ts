import { StreamClient } from '@stream-io/node-sdk';
import {
  AI_TEACHER_USER_ID,
  buildLessonCallCustomData,
} from '@/lib/lessonCallData';
import { getAuthUserId } from '@/lib/apiAuth';

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

    // Authenticate the caller via Clerk
    const userId = await getAuthUserId(req);
    if (!userId) {
      // Fall back to body userId for development when CLERK_SECRET_KEY is not set
      const body = await req.json();
      const bodyUserId = body.userId;
      if (!bodyUserId) {
        return Response.json({ error: 'Unauthorized: missing or invalid token' }, { status: 401 });
      }

      const { lessonId, languageId } = body;
      if (!lessonId) {
        return Response.json({ error: 'Missing lessonId in request body' }, { status: 400 });
      }

      const callId = `lesson-${lessonId}`;
      const call = client.video.call('audio_room', callId);
      const lessonCustomData = buildLessonCallCustomData(lessonId, languageId || 'unknown');

      await call.getOrCreate({
        data: {
          created_by_id: bodyUserId,
          members: [
            { user_id: bodyUserId, role: 'admin' },
            { user_id: AI_TEACHER_USER_ID, role: 'admin' },
          ],
          custom: lessonCustomData,
        },
      });

      return Response.json({ callId, status: 'created' });
    }

    const body = await req.json();
    const { lessonId, languageId } = body;

    if (!lessonId) {
      return Response.json({ error: 'Missing lessonId in request body' }, { status: 400 });
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

    return Response.json({ callId, status: 'created' });
  } catch (error) {
    console.error('Error creating call:', error);
    return Response.json({ error: 'Failed to create call' }, { status: 500 });
  }
}
