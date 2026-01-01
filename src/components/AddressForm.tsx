import React, { useState, useEffect } from 'react';
import { MapPin, Home, Loader2 } from 'lucide-react';
import { AddressData } from '../types';
import { reverseGeocode } from '../services/mapService';

interface AddressFormProps {
  location: { lat: number; lng: number } | null;
  onAddressComplete: (data: AddressData) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ location, onAddressComplete }) => {
  const [formData, setFormData] = useState<Partial<AddressData>>({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      fetchAddressFromCoordinates(location.lat, location.lng);
    }
  }, [location]);

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const addressData = await reverseGeocode(lat, lng);
      setFormData({
        ...addressData,
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && formData.street && formData.city && formData.country) {
      onAddressComplete({
        ...formData as AddressData,
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: `${formData.street}, ${formData.city}, ${formData.state ? formData.state + ', ' : ''}${formData.country}`,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold">Delivery Address Details</h3>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-blue-600 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm">Loading address data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="United States"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="10001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Info (Apt, Suite, etc.)
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Apartment 4B, Ring doorbell twice"
          />
        </div>

        {location && (
          <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-700">Coordinates</p>
              <p className="text-gray-600">
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!location}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Continue to Mint
        </button>
      </form>
    </div>
  );
};
