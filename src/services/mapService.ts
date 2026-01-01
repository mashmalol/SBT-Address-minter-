import axios from 'axios';
import { AddressData } from '../types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat: number, lng: number): Promise<Partial<AddressData>> {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
    });

    const { address } = response.data;

    return {
      street: address.road || address.pedestrian || address.suburb || address.neighbourhood || '',
      city: address.city || address.town || address.village || address.municipality || '',
      state: address.state || address.province || address.region || '',
      country: address.country || '',
      postalCode: address.postcode || '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    };
  }
}

export async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(`${NOMINATIM_API}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
