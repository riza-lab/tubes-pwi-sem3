import { NextApiRequest, NextApiResponse } from "next";
import {
  convertToModelMessages,
  InferUITools,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
  validateUIMessages,
} from "ai";
import { z } from "zod";

const searchCarsToolDefinition = tool({
  description: "Search for cars in the GO-RENT inventory with optional filters",
  inputSchema: z.object({
    brand: z.string().optional().describe("Car brand to filter by"),
    type: z
      .string()
      .optional()
      .describe("Car type to filter by (SUV, Sedan, etc)"),
    maxPrice: z.number().optional().describe("Maximum price per day"),
  }),
  outputSchema: z.object({
    cars: z.array(
      z.object({
        name: z.string(),
        model: z.string(),
        price_per_day: z.number(),
        type: z.string(),
      })
    ),
  }),
});

const getBookingInfoTool = tool({
  description:
    "Get information about rental policies, booking process, and terms",
  inputSchema: z.object({
    topic: z
      .string()
      .describe(
        "Topic: rental-duration, pricing, cancellation, insurance, payment"
      ),
  }),
  outputSchema: z.string(),
});

const contactSupportTool = tool({
  description: "Escalate to human support or get support contact information",
  inputSchema: z.object({
    issue: z.string().describe("Description of the issue"),
  }),
  outputSchema: z.string(),
});

const tools = {
  searchCars: searchCarsToolDefinition,
  getBookingInfo: getBookingInfoTool,
  contactSupport: contactSupportTool,
} as const;

export type AIChatMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<typeof tools>
>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const { messages } = body as { messages: AIChatMessage[] };

  const validatedMessages = await validateUIMessages<AIChatMessage>({
    messages,
    tools,
  });

  const result = streamText({
    model: "anthropic/claude-3-5-haiku-latest",
    messages: await convertToModelMessages(validatedMessages),
    tools,
    system: `You are a helpful customer service AI for GO-RENT, a premium luxury car rental service. 
You help customers find the perfect car for their needs, answer questions about bookings, pricing, and rental policies.
Be friendly, professional, and helpful. If you cannot help with something, offer to escalate to human support.
Provide specific recommendations based on customer needs.`,
  });

  return result.toUIMessageStreamResponse(res);
}
