import React, { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, polygonAmoy, hardhat } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { MapSelector } from './components/MapSelector';
import { AddressForm } from './components/AddressForm';
import { NFTMinter } from './components/NFTMinter';
import { AddressData } from './types';
import { Package, MapPin, CheckCircle } from 'lucide-react';
import { Card } from './components/ui/Card';

const config = getDefaultConfig({
  appName: 'Delivery Address SBT',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, polygonAmoy, hardhat],
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [hardhat.id]: http(),
  },
});

const queryClient = new QueryClient();

const StepIndicator: React.FC<{ currentStep: number; steps: string[] }> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
            1);
  };

  const handleAddressComplete = (data: AddressData) => {
    setAddressData(data);
    setStep(2);
  };

  const handleMintSuccess = () => {
    setTimeout(() => {
      setStep(0);
      setLocation(null);
      setAddressData(null);
    }, 3000
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  
  const steps = ['Select Location', 'Enter Details', 'Mint NFT'];

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setStep('form');
  };

  const handleAddressComplete = (data: AddressData) => {
    setAddressData(data);
    setStep('mint');
  };

  const handleMintSuccess = () => {
    alert('🎉 Address SBT minted successfully!');
    // Reset to start
    setStep('map');
    setLocation(null);
    setAddressData(null);
  };

  const handleReset = () => {
    setStep('map');
    setLocation(null);
    setAddressData(null);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
            <header className="bg-white shadow-md">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Address SBT</h1>
                    <p className="text-sm text-gray-600">Tokenize your delivery addresses</p>
                  </div>
                </div>
                <ConnectButton />
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className={`flex items-center gap-2 ${step === 'map' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                      1
                    </div>
                    <span>Select Location</span>
                  </div>
                  <div className="w-16 h-1 bg-gray-300"></div>
                  <div className={`flex items-center gap-2 ${step === 'form' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                      2
                    </div>
                    <span>Enter Details</span>
                  </div>
                  <div className="w-16 h-1 bg-gray-300"></div>
                  <div className={`flex items-center gap-2 ${step === 'mint' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'mint' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                      3
                    </div>
                    <span>Mint SBT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {step === 'map' && (
                  <div className="lg:col-span-2">
                    <MapSelector onLocationSelect={handleLocationSelect} selectedLocation={location} />
                    <p className="text-center text-gray-600 mt-4">
                      Click anywhere on the map to select your delivery location
                    </p>
                  </div>
                )}

                {step === 'form' && location && (
                  <>
                    <MapSelector onLocationSelect={handleLocationSelect} selectedLocation={location} />
                    <AddressForm location={location} onAddressComplete={handleAddressComplete} />
                  </>
                )}

                {step === 'mint' && addressData && (
                  <>
                    <MapSelector onLocationSelect={() => {}} selectedLocation={location} />
                    <NFTMinter addressData={addressData} onSuccess={handleMintSuccess} />
                  </>
                )}
              </div>

              {(step === 'form' || step === 'mint') && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleReset}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    ← Start Over
                  </button>
                </div>
              )}
            </main>

            <footer className="mt-16 py-8 bg-white border-t">
              <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
                <p className="mb-2">🔒 Soulbound Tokens - Non-transferable delivery addresses</p>
                <p className="text-sm">💰 Owner earns $5 per mint | 🌍 Powered by OpenStreetMap</p>
              </div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
