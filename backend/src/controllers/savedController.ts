import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { dbStore } from '../services/dbStore';

export async function getSavedItemsHandler(req: AuthRequest, res: Response) {
  try {
    const items = await dbStore.getSavedPlaces(req.user!.id);
    return res.json({ success: true, savedPlaces: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function addSavedItemHandler(req: AuthRequest, res: Response) {
  try {
    const { placeType, placeId, name, destination, metadata } = req.body;

    if (!placeType || !placeId || !name) {
      return res.status(400).json({
        success: false,
        error: 'placeType, placeId, and name are required.',
      });
    }

    const item = await dbStore.addSavedPlace(req.user!.id, {
      placeType,
      placeId,
      name,
      destination: destination || 'General',
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: 'Item saved successfully.',
      item,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function removeSavedItemHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await dbStore.removeSavedPlace(id, req.user!.id);
    return res.json({ success: true, message: 'Item removed from saved list.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
