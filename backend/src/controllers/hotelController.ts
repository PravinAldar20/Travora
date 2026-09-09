import { Request, Response } from 'express';
import { searchHotels, getHotelById, buildRealBookingDeepLink } from '../services/hotelService';
import { AuthRequest } from '../middleware/authMiddleware';
import { dbStore } from '../services/dbStore';

export async function searchHotelsHandler(req: Request, res: Response) {
  try {
    const {
      destination,
      minPrice,
      maxPrice,
      minRating,
      category,
      freeCancellationOnly,
      sortBy,
      centerLat,
      centerLon,
      amenities,
    } = req.query;

    const hotels = searchHotels({
      destination: destination as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      category: category as string,
      freeCancellationOnly: freeCancellationOnly === 'true',
      sortBy: sortBy as any,
      centerLat: centerLat ? Number(centerLat) : undefined,
      centerLon: centerLon ? Number(centerLon) : undefined,
      amenities: amenities ? (amenities as string).split(',') : undefined,
    });

    return res.json({
      success: true,
      count: hotels.length,
      hotels,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getHotelDetailsHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const hotel = getHotelById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found.' });
    }

    return res.json({ success: true, hotel });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function bookHotelHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { hotelId, checkIn, checkOut, guests, rooms, tripId } = req.body;

    const hotel = getHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Selected hotel not found.' });
    }

    const checkInDate = checkIn || new Date().toISOString().split('T')[0];
    const checkOutDate =
      checkOut || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

    // Build real provider deep link
    const realBookingUrl = buildRealBookingDeepLink(hotel, checkInDate, checkOutDate, Number(guests) || 2);

    // Calculate total amount
    const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = hotel.pricePerNight * nights * (Number(rooms) || 1);

    // Store verified booking record
    const booking = await dbStore.createHotelBooking({
      userId,
      tripId: tripId || null,
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn: new Date(checkInDate).toISOString(),
      checkOut: new Date(checkOutDate).toISOString(),
      guests: Number(guests) || 2,
      rooms: Number(rooms) || 1,
      provider: hotel.provider,
      bookingUrl: realBookingUrl,
      totalAmount,
      currency: hotel.currency,
    });

    return res.json({
      success: true,
      message: 'Booking initiated with official partner network.',
      booking,
      providerRedirectUrl: realBookingUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getUserBookingsHandler(req: AuthRequest, res: Response) {
  try {
    const bookings = await dbStore.getBookingsByUser(req.user!.id);
    return res.json({ success: true, bookings });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
