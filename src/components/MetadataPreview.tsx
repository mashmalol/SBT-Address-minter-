import React from 'react';
import { MapPin, FileText } from 'lucide-react';
import { AddressData } from '../types';

interface MetadataPreviewProps {
  addressData: AddressData;
}

export const MetadataPreview: React.FC<MetadataPreviewProps> = ({ addressData }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-800">Token Metadata Preview</h4>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Full Address</p>
          <p className="font-medium text-gray-900 mt-1">{addressData.formattedAddress}</p>
        </div>

        {addressData.additionalInfo && (
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Additional Info</p>
            <p className="font-medium text-gray-900 mt-1">{addressData.additionalInfo}</p>
          </div>
        )}

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <MapPin className="w-3 h-3" /> GPS Coordinates
          </p>
          <p className="font-mono text-sm text-gray-900 mt-1">
            {addressData.latitude.toFixed(6)}°, {addressData.longitude.toFixed(6)}°
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Postal Code</p>
            <p className="font-medium text-gray-900 mt-1">{addressData.postalCode}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
            <p className="font-medium text-gray-900 mt-1">{addressData.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
