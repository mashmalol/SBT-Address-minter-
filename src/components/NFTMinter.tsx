import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AddressData } from '../types';
import { MetadataPreview } from './MetadataPreview';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract.config';

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold">Mint Your Address SBT</h3>
      </div>

      <MetadataPreview addressData={addressData} />

      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Minting Fee:</strong> 0.005 ETH (testnet) / $5.00 USD (mainnet)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            This is a <strong>Soulbound Token</strong> - it cannot be transferred or sold.
          </p>
        </div>

        {!isConnected ? (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Please connect your wallet to mint</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Successfully minted!</p>
            </div>
            {hash && (
              <p className="text-xs font-mono break-all">
                Transaction: {hash}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {(isPending || isConfirming) && <Loader2 className="w-5 h-5 animate-spin" />}
            {isConfirming ? 'Confirming Transaction...' : isPending ? 'Check Wallet...' : 'Mint Address SBT'}
          </button>
        )}

        {isConnected && (
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p className="mt-1"><strong>Contract:</strong> {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          By minting, you agree that this token is soulbound and cannot be transferred.
        </p>
      </div>
    </div>
  );
};
