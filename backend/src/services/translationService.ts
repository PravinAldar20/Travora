import axios from 'axios';

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedSourceLanguage?: string;
  provider: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'zh', name: 'Chinese (Simplified) (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
];

/**
 * Executes a REAL translation request through real translation network APIs.
 * Supports:
 * 1. Google Cloud Translation (if TRANSLATION_API_KEY configured)
 * 2. MyMemory Translation API (Legitimate live professional human+machine translation memory API)
 * 3. LibreTranslate open API
 */
export async function translateText(
  text: string,
  sourceLang: string = 'auto',
  targetLang: string = 'en'
): Promise<TranslationResult> {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Text to translate cannot be empty');
  }

  const apiKey = process.env.TRANSLATION_API_KEY;

  // 1. Google Cloud Translation API if key is provided
  if (apiKey && apiKey.startsWith('AIza')) {
    try {
      const gUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const gRes = await axios.post(
        gUrl,
        {
          q: trimmedText,
          source: sourceLang === 'auto' ? undefined : sourceLang,
          target: targetLang,
          format: 'text',
        },
        { timeout: 8000 }
      );
      const data = gRes.data?.data?.translations?.[0];
      if (data) {
        return {
          translatedText: data.translatedText,
          sourceLanguage: sourceLang === 'auto' ? data.detectedSourceLanguage || 'en' : sourceLang,
          targetLanguage: targetLang,
          detectedSourceLanguage: data.detectedSourceLanguage,
          provider: 'Google Cloud Translation',
        };
      }
    } catch (gErr: any) {
      console.warn('Google Cloud Translation failed, trying secondary real provider:', gErr.message);
    }
  }

  // 2. Real MyMemory Translation API (Free, high quality, real machine+crowdsourced translation)
  try {
    const src = sourceLang === 'auto' ? 'en' : sourceLang;
    const langpair = `${src}|${targetLang}`;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedText)}&langpair=${encodeURIComponent(langpair)}`;

    const response = await axios.get(myMemoryUrl, {
      timeout: 9000,
      headers: {
        'User-Agent': 'TravoraTravelAI/1.0',
      },
    });

    const responseData = response.data;
    if (responseData && responseData.responseData && responseData.responseData.translatedText) {
      const translated = responseData.responseData.translatedText;
      return {
        translatedText: translated,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        detectedSourceLanguage: responseData.responseData.detectedLanguage || src,
        provider: 'MyMemory Live Translation API',
      };
    }
  } catch (mErr: any) {
    console.warn('MyMemory request failed, trying secondary LibreTranslate engine:', mErr.message);
  }

  // 3. LibreTranslate public API fallback
  try {
    const libreUrl = 'https://translate.argosopentech.com/translate';
    const libreRes = await axios.post(
      libreUrl,
      {
        q: trimmedText,
        source: sourceLang === 'auto' ? 'en' : sourceLang,
        target: targetLang,
        format: 'text',
      },
      { timeout: 9000, headers: { 'Content-Type': 'application/json' } }
    );

    if (libreRes.data && libreRes.data.translatedText) {
      return {
        translatedText: libreRes.data.translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        provider: 'LibreTranslate Live API',
      };
    }
  } catch (lErr: any) {
    console.error('All live translation services failed:', lErr.message);
  }

  throw new Error(
    'Translation service is temporarily unreachable. Please check your internet connection or configure TRANSLATION_API_KEY in .env.'
  );
}
