// TODO: Update to viem/wagmi v2 - currently using old ethers v5 syntax
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { LazyMintVoucher } from '../types';

export class LazyMintingService {
  private signer: any; // ethers.Signer;
  private contractAddress: string;

  constructor(signer: any, contractAddress: string) {
    this.signer = signer;
    this.contractAddress = contractAddress;
  }

  async createVoucher(
    tokenId: number,
    minter: string,
    metadata: any
  ): Promise<LazyMintVoucher> {
    const domain = {
      name: 'DeliveryAddressSBT',
      version: '1',
      chainId: (await (this.signer as any).getChainId?.()) || 1,
      verifyingContract: this.contractAddress,
    };

    const types = {
      LazyMintVoucher: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'minter', type: 'address' },
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'postalCode', type: 'string' },
      ],
    };

    const value = {
      tokenId,
      minter,
      street: metadata.street,
      city: metadata.city,
      postalCode: metadata.postalCode,
    };

    const signature = await (this.signer as any).signTypedData(domain, types, value);

    return {
      tokenId,
      minter,
      metadata,
      signature,
    };
  }

  async verifyVoucher(voucher: LazyMintVoucher): Promise<boolean> {
    try {
      const domain = {
        name: 'DeliveryAddressSBT',
        version: '1',
        chainId: (await (this.signer as any).getChainId?.()) || 1,
        verifyingContract: this.contractAddress,
      };

      const types = {
        LazyMintVoucher: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'minter', type: 'address' },
          { name: 'street', type: 'string' },
          { name: 'city', type: 'string' },
          { name: 'postalCode', type: 'string' },
        ],
      };

      const value = {
        tokenId: voucher.tokenId,
        minter: voucher.minter,
        street: voucher.metadata.street,
        city: voucher.metadata.city,
        postalCode: voucher.metadata.postalCode,
      };

      const recoveredAddress = (ethers as any).utils?.verifyTypedData(
        domain,
        types,
        value,
        voucher.signature
      );

      const signerAddress = await this.signer.getAddress();
      return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
    } catch (error) {
      console.error('Voucher verification error:', error);
      return false;
    }
  }
}
