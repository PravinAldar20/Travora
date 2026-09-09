import { Request, Response } from 'express';
import { fetchRealWeather } from '../services/weatherService';

export async function getWeatherHandler(req: Request, res: Response) {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lon = req.query.lon ? Number(req.query.lon) : undefined;

    if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        error: 'Latitude (lat) and Longitude (lon) are required numeric parameters.',
      });
    }

    const weather = await fetchRealWeather(lat, lon);
    return res.json({
      success: true,
      weather,
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      error: error.message || 'Weather data unavailable. Try again later.',
    });
  }
}
