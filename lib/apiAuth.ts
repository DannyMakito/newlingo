import { verifyToken } from '@clerk/backend';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

/**
 * Extracts and verifies the Clerk user ID from a request's Authorization header.
 * Returns the userId string on success, or null if missing/invalid.
 */
export async function getAuthUserId(req: Request): Promise<string | null> {
  if (!clerkSecretKey) {
    console.warn('CLERK_SECRET_KEY not set — skipping auth verification');
    return null;
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: clerkSecretKey,
      publishableKey: clerkPublishableKey,
    });
    return payload.sub ?? null;
  } catch (err) {
    console.error('Clerk token verification failed:', err);
    return null;
  }
}
