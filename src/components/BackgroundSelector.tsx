import React, { useState } from 'react';
import { Sparkles, Network, Box } from 'lucide-react';
import { MatrixRain } from './backgrounds/MatrixRain';
import { ParticleNetwork } from './backgrounds/ParticleNetwork';
import { FloatingBlocks } from './backgrounds/FloatingBlocks';

type BackgroundType = 'matrix' | 'particles' | 'blocks' | 'none';

export const BackgroundSelector: React.FC = () => {
  const [background, setBackground] = useState<BackgroundType>('matrix');
  const [isOpen, setIsOpen] = useState(false);

  const backgrounds = [
    { id: 'matrix' as const, name: 'Matrix Rain', icon: Sparkles, color: 'text-green-400' },
    { id: 'particles' as const, name: 'Particle Network', icon: Network, color: 'text-blue-400' },
    { id: 'blocks' as const, name: 'Floating Blocks', icon: Box, color: 'text-purple-400' },
    { id: 'none' as const, name: 'None', icon: () => <span className="text-lg">✕</span>, color: 'text-gray-400' },
  ];

  return (
    <>
      {/* Background Renderer */}
      {background === 'matrix' && <MatrixRain />}
      {background === 'particles' && <ParticleNetwork />}
      {background === 'blocks' && <FloatingBlocks />}

      {/* Selector Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {isOpen && (
            <>
              <div 
                className="fixed inset-0" 
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute bottom-16 right-0 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden min-w-[200px]">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Background Effect</p>
                </div>
                <div className="p-2">
                  {backgrounds.map((bg) => {
                    const Icon = bg.icon;
                    const isActive = background === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setBackground(bg.id);
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                          ${isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-800'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : bg.color}`} />
                        <span className="text-sm font-medium">{bg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-gray-900/95 backdrop-blur-md rounded-full shadow-lg border border-gray-700 flex items-center justify-center hover:scale-110 transition-transform group"
            title="Change Background"
          >
            <Sparkles className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
};
