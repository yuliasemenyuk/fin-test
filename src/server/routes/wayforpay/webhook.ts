import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Webhook received:", req.body);
    
    // Webhook processing:
    // 1. Validate webhook signature
    // 2. Parse payment status
    // 3. Update database (or send to .NET backend)
    
    res.json({
      success: true,
      message: "Webhook processed successfully"
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { router };