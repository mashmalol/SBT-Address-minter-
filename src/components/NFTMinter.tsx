import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Wallet, CheckCircle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { AddressData } from '../types';
import { MetadataPreview } from './MetadataPreview';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract.config';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface NFTMinterProps {
  addressData: AddressData;
  onSuccess: () => void;
}

export const NFTMinter: React.FC<NFTMinterProps> = ({ addressData, onSuccess }) => {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string>('');

  const metadata = {
    street: addressData.street,
    city: addressData.city,
    state: addressData.state || '',
    country: addressData.country,
    postalCode: addressData.postalCode,
    latitude: BigInt(Math.floor(addressData.latitude * 1e6)),
    longitude: BigInt(Math.floor(addressData.longitude * 1e6)),
    mintedAt: BigInt(0),
    additionalInfo: addressData.additionalInfo || '',
  };

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError('');
      console.log('Minting with metadata:', metadata);
      console.log('Contract address:', CONTRACT_ADDRESS);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintAddress',
        args: [metadata],
        value: parseEther('0.005'), // 0.005 ETH for testing (change to 5 for mainnet)
      });
    } catch (err: any) {
      console.error('Minting error:', err);
      setError(err.message || 'Minting failed');
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      console.log('Mint successful! Transaction:', hash);
      onSuccess();
    }
  }, [isSuccess, onSuccess, hash]);

  React.useEffect(() => {
    if (writeError) {
      setError(writeError.message);
      console.error('Write error:', writeError);
    }
  }, [writeError]);

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Mint Your Address SBT</h3>
            <p className="text-sm text-gray-600">Complete your tokenization</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <MetadataPreview addressData={addressData} />

        {/* Pricing Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Minting Fee</span>
            <Badge variant="info" size="lg">0.005 ETH</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span>Soulbound Token - Cannot be transferred</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-700">
            <TrendingUp className="w-4 h-4" />
            <span>Earn 100 ADDR tokens as reward</span>
          </div>
        </div>

        {/* Status Messages */}
        {!isConnected ? (
          <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">Please connect your wallet to mint</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col gap-3 text-green-700 bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-bold">Successfully minted!</p>
            </div>
            {hash && (
              <p className="text-xs font-mono text-gray-600 break-all bg-white p-2 rounded">
                {hash}
              </p>
            )}
          </div>
        ) : null}

        {/* Wallet Info */}
        {isConnected && !isSuccess && (
          <div className="text-xs space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Connected Wallet:</span>
              <span className="font-mono font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contract:</span>
              <span className="font-mono font-medium">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {!isSuccess && (
          <Button
            onClick={handleMint}
            disabled={!isConnected || isPending || isConfirming}
            loading={isPending || isConfirming}
            size="lg"
            className="w-full"
            icon={<Wallet className="w-5 h-5" />}
          >
            {isConfirming ? 'Confirming...' : isPending ? 'Check Wallet' : 'Mint Address SBT'}
          </Button>
        )}
        <p className="text-xs text-gray-500 text-center mt-3">
          By minting, you agree that this token is soulbound and cannot be transferred.
        </p>
      </CardFooter>
    </Card>
  );
};
