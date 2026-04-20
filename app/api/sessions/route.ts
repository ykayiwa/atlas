import {
  createSession,
  getSessions,
  getSessionMessages,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json([]);
    }

    const sessions = await getSessions(user.id);
    return Response.json(sessions);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return Response.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

const CreateSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title } = CreateSessionSchema.parse(body);
    const session = await createSession(user.id, title);
    return Response.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request format", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("Sessions POST error:", error);
    return Response.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
