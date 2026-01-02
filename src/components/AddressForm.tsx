import React, { useState, useEffect } from 'react';
import { MapPin, Home, Mail, Building2, Globe, Loader2 } from 'lucide-react';
import { AddressData } from '../types';
import { reverseGeocode } from '../services/mapService';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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
    elevation: 0,
    populationDensity: 0,
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
    <Card className="animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Address Details</h3>
              <p className="text-sm text-gray-600">Fill in your delivery information</p>
            </div>
          </div>
          {loading && <Badge variant="info"><Loader2 className="w-3 h-3 animate-spin mr-1" />Loading...</Badge>}
        </div>
      </  {/* Street Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
              placeholder="123 Main Street"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                placeholder="NY"
              />
            </div>
          </div>

          {/* Country & Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Globe className="w-4 h-4 text-blue-600" />
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                placeholder="United States"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 text-blue-600" />
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium resize-none"
              rows={3}
              placeholder="Apartment 4B, Ring doorbell twice..."
            />
          </div>

          {/* Coordinates Display */}
          {location && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">GPS Coordinates</p>
                  <p className="text-gray-700 font-mono text-sm mt-1">
                    {location.lat.toFixed(6)}°, {location.lng.toFixed(6)}°
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={!location}
            size="lg"
            className="w-full"
            icon={<Home className="w-5 h-5" />}
          >
            Continue to Mint
          </Button>
        </CardFooter>
      </form>
    </Card
          Continue to Mint
        </button>
      </form>
    </div>
  );
};
