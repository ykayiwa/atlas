import { getSessionById, getSessionMessages } from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify session belongs to user
    const chatSession = await getSessionById(id, session.user.id);
    if (!chatSession) {
      return Response.json(
        { error: "Session not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const messages = await getSessionMessages(id);
    return Response.json(messages);
  } catch (error) {
    console.error("Session messages GET error:", error);
    return Response.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
