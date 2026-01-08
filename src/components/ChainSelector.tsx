import React, { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { ChevronDown, Check, Zap } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../config/chains.config';

export const ChainSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const currentChain = chainId 
    ? Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId)
    : SUPPORTED_CHAINS.sepolia;

  const handleChainSwitch = (newChainId: number) => {
    switchChain({ chainId: newChainId });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
        <span className="text-sm font-semibold text-gray-700">
          {currentChain?.name || 'Select Chain'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Select Network</p>
              <p className="text-xs text-gray-600 mt-1">Choose blockchain to mint on</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {/* Production Chains */}
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Mainnet</p>
                {Object.entries(SUPPORTED_CHAINS)
                  .filter(([key]) => !key.includes('sepolia') && !key.includes('mumbai'))
                  .map(([key, chainConfig]) => {
                    const isActive = chainId === chainConfig.id;
                    
                    return (
                      <button
                        key={key}
                        onClick={() => handleChainSwitch(chainConfig.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-all
                          ${isActive ? 'bg-blue-50 ring-2 ring-blue-500' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
                          `}>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                          </div>
                          
                          <div className="text-left">
                            <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                              {chainConfig.name}
                            </p>
                            <p className="text-xs text-gray-500">Chain ID: {chainConfig.id}</p>
                          </div>
                        </div>
                        
                        {isActive && (
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <Check className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Testnets */}
              <div className="p-2 border-t border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Testnets</p>
                {Object.entries(SUPPORTED_CHAINS)
                  .filter(([key]) => key.includes('sepolia') || key.includes('mumbai'))
                  .map(([key, chainConfig]) => {
                    const isActive = chainId === chainConfig.id;
                    
                    return (
                      <button
                        key={key}
                        onClick={() => handleChainSwitch(chainConfig.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-all
                          ${isActive ? 'bg-amber-50 ring-2 ring-amber-500' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${isActive ? 'bg-amber-100' : 'bg-gray-100'}
                          `}>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                          </div>
                          
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold ${isActive ? 'text-amber-700' : 'text-gray-900'}`}>
                                {chainConfig.name}
                              </p>
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                Testnet
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Chain ID: {chainConfig.id}</p>
                          </div>
                        </div>
                        
                        {isActive && <Check className="w-5 h-5 text-amber-600" />}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-600 text-center">
                💡 Switch networks to access different deployments
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
