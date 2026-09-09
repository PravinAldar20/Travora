import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { dbStore } from '../services/dbStore';
import { generateAiItinerary } from '../services/aiService';
import { optimizeRouteOrder, calculateDistanceKm, estimateTravelTimeMinutes } from '../utils/geoUtils';

export async function createTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const {
      title,
      destination,
      country,
      city,
      latitude,
      longitude,
      startDate,
      endDate,
      adults,
      children,
      budget,
      currency,
      travelStyle,
      interests,
      hotelId,
      itineraryItems,
    } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Destination, start date, and end date are required.',
      });
    }

    const trip = await dbStore.createTrip({
      userId,
      title: title || `Trip to ${destination}`,
      destination,
      country: country || '',
      city: city || destination,
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      budget: Number(budget) || 1000,
      currency: currency || 'USD',
      travelStyle: travelStyle || 'Standard',
      interests: Array.isArray(interests) ? interests : [],
      hotelId: hotelId || null,
      itineraryItems: itineraryItems || [],
    });

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully.',
      trip,
    });
  } catch (error: any) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getUserTrips(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const trips = await dbStore.getTripsByUser(userId);
    return res.json({ success: true, trips });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getTripById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const trip = await dbStore.getTripById(id);

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found.' });
    }

    // Ensure privacy unless shared via shareId
    if (trip.userId !== req.user!.id && trip.shareId !== id) {
      return res.status(403).json({ success: false, error: 'Unauthorized access to this private trip.' });
    }

    return res.json({ success: true, trip });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateTrip(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await dbStore.getTripById(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found.' });
    }
    if (existing.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to update this trip.' });
    }

    const updated = await dbStore.updateTrip(id, req.body);
    return res.json({
      success: true,
      message: 'Trip updated successfully.',
      trip: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteTrip(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await dbStore.getTripById(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found.' });
    }
    if (existing.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this trip.' });
    }

    await dbStore.deleteTrip(id);
    return res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function duplicateTrip(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const duplicated = await dbStore.duplicateTrip(id, req.user!.id);
    if (!duplicated) {
      return res.status(404).json({ success: false, error: 'Trip to duplicate not found.' });
    }
    return res.status(201).json({
      success: true,
      message: 'Trip duplicated successfully.',
      trip: duplicated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function generateItineraryForTrip(req: AuthRequest, res: Response) {
  try {
    const {
      destinationId,
      startDate,
      endDate,
      adults,
      children,
      totalBudget,
      currency,
      travelStyle,
      interests,
      hotelId,
      preferences,
    } = req.body;

    const generated = await generateAiItinerary({
      destinationId,
      startDate,
      endDate,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      totalBudget: Number(totalBudget) || 1500,
      currency: currency || 'USD',
      travelStyle: travelStyle || 'Standard',
      interests: Array.isArray(interests) ? interests : ['Historical places', 'Culture'],
      hotelId,
      preferences,
    });

    return res.json({
      success: true,
      message: 'Personalized AI itinerary generated successfully with smart route optimization.',
      data: generated,
    });
  } catch (error: any) {
    console.error('Itinerary generation error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function optimizeTripItinerary(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const trip = await dbStore.getTripById(id);

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found.' });
    }

    const items = trip.itineraryItems || [];
    if (items.length <= 1) {
      return res.json({
        success: true,
        message: 'Itinerary already optimal.',
        trip,
      });
    }

    // Group by dayNumber
    const dayMap = new Map<number, any[]>();
    for (const item of items) {
      const list = dayMap.get(item.dayNumber) || [];
      list.push(item);
      dayMap.set(item.dayNumber, list);
    }

    const origin = { latitude: trip.latitude, longitude: trip.longitude };
    const optimizedItems: any[] = [];

    for (const [dayNum, dayActivities] of dayMap.entries()) {
      const { optimizedPoints } = optimizeRouteOrder(origin, dayActivities);
      let prevLat = origin.latitude;
      let prevLon = origin.longitude;

      for (let idx = 0; idx < optimizedPoints.length; idx++) {
        const act = optimizedPoints[idx];
        const dist = calculateDistanceKm(prevLat, prevLon, act.latitude, act.longitude);
        const travelMins = estimateTravelTimeMinutes(dist, 'Transit');

        optimizedItems.push({
          ...act,
          dayNumber: dayNum,
          orderIndex: idx + 1,
          distanceKm: dist,
          travelTimeMinutes: travelMins,
        });

        prevLat = act.latitude;
        prevLon = act.longitude;
      }
    }

    const updatedTrip = await dbStore.updateTrip(id, { itineraryItems: optimizedItems });

    return res.json({
      success: true,
      message: 'Itinerary successfully recalculated and geographically optimized.',
      trip: updatedTrip,
    });
  } catch (error: any) {
    console.error('Optimize itinerary error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
