import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { translateText, SUPPORTED_LANGUAGES } from '../services/translationService';
import { dbStore } from '../services/dbStore';
import { AuthRequest } from '../middleware/authMiddleware';

const PHRASEBOOK_CATEGORIES = [
  {
    category: 'Greetings',
    phrases: [
      'Hello / Good day',
      'Thank you very much',
      'Please',
      'Excuse me / Sorry',
      'Do you speak English?',
      'Yes / No',
      'Goodbye',
    ],
  },
  {
    category: 'Hotel',
    phrases: [
      'I have a reservation under this name.',
      'What time is check-in and check-out?',
      'Could you keep my luggage until check-in?',
      'Is breakfast included?',
      'What is the Wi-Fi password?',
      'Can I request extra towels?',
    ],
  },
  {
    category: 'Restaurant',
    phrases: [
      'A table for two, please.',
      'May I see the menu?',
      'What is the local specialty dish?',
      'Could I have the check / bill, please?',
      'Do you have vegetarian or vegan options?',
      'Water, please.',
    ],
  },
  {
    category: 'Transportation',
    phrases: [
      'Where is the nearest railway or metro station?',
      'How much is a ticket to the city center?',
      'Does this bus or train stop at the airport?',
      'Please turn on the taxi meter.',
      'Could you stop here, please?',
    ],
  },
  {
    category: 'Shopping',
    phrases: [
      'How much does this cost?',
      'Do you accept credit cards?',
      'Can I get a tax-free refund receipt?',
      'Do you have this in a different size or color?',
      'I am just browsing, thank you.',
    ],
  },
  {
    category: 'Directions',
    phrases: [
      'Where is the bathroom / restroom?',
      'How do I get to this address on the map?',
      'Is it within walking distance?',
      'Turn left / Turn right / Go straight ahead',
    ],
  },
  {
    category: 'Emergency',
    phrases: [
      'Please help me!',
      'Call an ambulance / I need a doctor.',
      'Where is the nearest hospital or pharmacy?',
      'I have lost my passport and wallet.',
      'Call the police, please.',
    ],
  },
];

export async function translateHandler(req: Request, res: Response) {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid text to translate.',
      });
    }

    const src = sourceLanguage || 'auto';
    const tgt = targetLanguage || 'en';

    const result = await translateText(text, src, tgt);

    // If request has auth token, log to history
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token) as { id?: string } | null;
        if (decoded && decoded.id) {
          await dbStore.logTranslation(
            decoded.id,
            text,
            result.sourceLanguage,
            result.targetLanguage,
            result.translatedText
          );
        }
      } catch (logErr) {
        // Non-blocking
      }
    }

    return res.json({
      success: true,
      translatedText: result.translatedText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage,
      detectedSourceLanguage: result.detectedSourceLanguage,
      provider: result.provider,
    });
  } catch (error: any) {
    console.error('Translation endpoint error:', error.message);
    return res.status(502).json({
      success: false,
      error: error.message || 'Translation service unavailable. Please try again.',
    });
  }
}

export async function getSupportedLanguagesHandler(req: Request, res: Response) {
  return res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
  });
}

export async function getPhrasebookHandler(req: Request, res: Response) {
  return res.json({
    success: true,
    categories: PHRASEBOOK_CATEGORIES,
  });
}

export async function getTranslationHistoryHandler(req: AuthRequest, res: Response) {
  try {
    const history = await dbStore.getTranslationHistory(req.user!.id);
    return res.json({ success: true, history });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteTranslationHistoryHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await dbStore.deleteTranslationHistory(id, req.user!.id);
    return res.json({ success: true, message: 'History item removed.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
