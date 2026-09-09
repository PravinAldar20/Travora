import { Request, Response } from 'express';
import { chatWithAiTravelAssistant } from '../services/aiService';
import { dbStore } from '../services/dbStore';
import { AuthRequest } from '../middleware/authMiddleware';

export async function aiChatHandler(req: AuthRequest, res: Response) {
  try {
    const { message, tripId } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message for the AI assistant.',
      });
    }

    let tripContext: any = null;
    if (tripId) {
      tripContext = await dbStore.getTripById(tripId);
    }

    let userPreferences: any = null;
    if (req.user?.id) {
      userPreferences = await dbStore.getPreferences(req.user.id);
    }

    const aiResponse = await chatWithAiTravelAssistant({
      message,
      tripContext,
      userPreferences,
    });

    return res.json({
      success: true,
      ...aiResponse,
    });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to process AI assistant request. Please try again.',
    });
  }
}
