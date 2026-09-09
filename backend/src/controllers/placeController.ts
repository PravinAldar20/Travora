import { Request, Response } from 'express';
import {
  searchDestinations,
  getDestinationById,
  DESTINATIONS_CATALOG,
  recommendDestinations,
} from '../services/placeService';
import { calculateRealRoute } from '../services/routingService';

export async function searchDestinationsHandler(req: Request, res: Response) {
  try {
    const query = req.query.q as string || '';
    const results = searchDestinations(query);
    return res.json({ success: true, count: results.length, destinations: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getDestinationDetailsHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const destination = getDestinationById(id);
    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found in catalog.' });
    }
    return res.json({ success: true, destination });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getExploreFeedHandler(req: Request, res: Response) {
  try {
    const { category, destinationId } = req.query;
    let attractions: any[] = [];
    let restaurants: any[] = [];

    const targetDestinations = destinationId
      ? DESTINATIONS_CATALOG.filter(d => d.id === destinationId)
      : DESTINATIONS_CATALOG;

    for (const d of targetDestinations) {
      attractions.push(...d.topAttractions.map(a => ({ ...a, destination: d.name, destinationId: d.id })));
      restaurants.push(...d.restaurants.map(r => ({ ...r, destination: d.name, destinationId: d.id })));
    }

    if (category) {
      const cat = (category as string).toLowerCase();
      attractions = attractions.filter(a => a.category.toLowerCase().includes(cat));
    }

    return res.json({
      success: true,
      attractions,
      restaurants,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function calculateRouteHandler(req: Request, res: Response) {
  try {
    const { waypoints, mode } = req.body;
    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least two waypoints with latitude and longitude are required.',
      });
    }

    const routeResult = await calculateRealRoute(waypoints, mode || 'driving');
    return res.json({
      success: true,
      route: routeResult,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function recommendDestinationsHandler(req: Request, res: Response) {
  try {
    const { budgetUSD, season, days, vibe, continent } = req.body;
    const recommendations = recommendDestinations({
      budgetUSD: budgetUSD ? Number(budgetUSD) : undefined,
      season,
      days: days ? Number(days) : undefined,
      vibe,
      continent,
    });

    return res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
