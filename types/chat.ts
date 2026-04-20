import type { SourceReference } from "./database";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceReference[];
  createdAt?: Date;
}

export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  sessionId?: string;
}

export interface FeedbackRequest {
  messageId: string;
  rating: 1 | -1;
}
