import { saveFeedback } from "@/lib/db/queries";
import { z } from "zod";

const FeedbackSchema = z.object({
  messageId: z.string().uuid(),
  rating: z.union([z.literal(1), z.literal(-1)]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageId, rating } = FeedbackSchema.parse(body);

    const feedback = await saveFeedback(messageId, rating);

    return Response.json({ success: true, id: feedback.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request format", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("Feedback API error:", error);
    return Response.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
