import React, { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { MapSelector } from './components/MapSelector';
import { AddressForm } from './components/AddressForm';
import { NFTMinter } from './components/NFTMinter';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ChainSelector } from './components/ChainSelector';
import { BackgroundSelector } from './components/BackgroundSelector';
import { AddressData } from './types';
import { Package, MapPin, CheckCircle, BarChart3, Wallet, Zap } from 'lucide-react';
import { Card } from './components/ui/Card';
import { ALL_CHAINS, TESTNET_CHAINS } from './config/chains.config';

// Use testnet chains for development
const chains = import.meta.env.VITE_APP_ENV === 'production' 
  ? ALL_CHAINS 
  : TESTNET_CHAINS;

const config = getDefaultConfig({
  appName: 'Delivery Address SBT',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [...chains] as any,
});

const queryClient = new QueryClient();

const StepIndicator: React.FC<{ currentStep: number; steps: string[] }> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                index < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const steps = ['Select Location', 'Enter Details', 'Mint NFT', 'Analytics'];

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setStep(1);
  };

  const handleAddressComplete = (data: AddressData) => {
    setAddressData(data);
    setStep(2);
  };

  const handleMintSuccess = () => {
    setStep(3);
    setTimeout(() => {
      setShowAnalytics(true);
    }, 1000);
  };

  const handleReset = () => {
    setStep(0);
    setLocation(null);
    setAddressData(null);
    setShowAnalytics(false);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* Animated Background */}
          <BackgroundSelector />

          <div className="min-h-screen">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 animate-slide-up">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Delivery Address SBT
                    </h1>
                    <p className="text-sm text-gray-400">Multi-Chain NFT Minting</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <ChainSelector />
                  <ConnectButton />
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
              {!showAnalytics ? (
                <>
                  {/* Hero Section */}
                  {step === 0 && (
                    <div className="text-center mb-12 animate-fade-in">
                      <h2 className="text-4xl font-bold text-white mb-4">
                        Mint Your <span className="text-blue-400">Address NFT</span>
                      </h2>
                      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Select a location on the map to create a unique, non-transferable token 
                        representing your delivery address. Available on 7+ chains!
                      </p>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  <StepIndicator currentStep={step} steps={steps} />

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {step === 0 && (
                      <div className="lg:col-span-2 space-y-6">
                        <MapSelector onLocationSelect={handleLocationSelect} selectedLocation={location} />
                        <p className="text-center text-gray-300">
                          🗺️ Click anywhere on the map to select your delivery location
                        </p>
                        
                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                          {[
                            { icon: '🔗', title: '7+ Blockchains', desc: 'Multi-chain support' },
                            { icon: '🔒', title: 'Soulbound', desc: 'Non-transferable' },
                            { icon: '💰', title: '100 ADDR', desc: 'Earn rewards' },
                          ].map((feature, i) => (
                            <Card key={i} className="p-4 text-center hover:shadow-lg transition-shadow bg-gray-900/50 backdrop-blur-md border-gray-700">
                              <div className="text-3xl mb-2">{feature.icon}</div>
                              <h3 className="font-bold text-white">{feature.title}</h3>
                              <p className="text-sm text-gray-400">{feature.desc}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 1 && location && (
                      <>
                        <Card hover className="overflow-hidden bg-gray-900/50 backdrop-blur-md border-gray-700">
                          <MapSelector onLocationSelect={handleLocationSelect} selectedLocation={location} />
                        </Card>
                        <AddressForm location={location} onAddressComplete={handleAddressComplete} />
                      </>
                    )}

                    {step === 2 && addressData && (
                      <>
                        <Card hover className="overflow-hidden bg-gray-900/50 backdrop-blur-md border-gray-700">
                          <MapSelector onLocationSelect={() => {}} selectedLocation={location} />
                        </Card>
                        <NFTMinter addressData={addressData} onSuccess={handleMintSuccess} />
                      </>
                    )}
                  </div>

                  {/* Statistics Section */}
                  {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                      {[
                        { label: 'Total Mints', value: '1,234', icon: Package, color: 'blue' },
                        { label: 'ADDR Distributed', value: '123.4K', icon: Wallet, color: 'purple' },
                        { label: 'Active Chains', value: '7', icon: Zap, color: 'green' },
                      ].map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-lg transition-shadow bg-gray-900/50 backdrop-blur-md border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-14 h-14 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                              <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Reset Button */}
                  {step > 0 && (
                    <div className="mt-6 text-center animate-fade-in">
                      <button
                        onClick={handleReset}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        ← Start Over
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <AnalyticsDashboard onBack={handleReset} />
              )}
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 bg-gray-900/80 backdrop-blur-md border-t border-gray-700">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    © 2026 Delivery Address SBT • Multi-Chain NFT Platform
                  </p>
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    <BarChart3 className="w-5 h-5" />
                    {showAnalytics ? 'Hide' : 'View'} Analytics
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
