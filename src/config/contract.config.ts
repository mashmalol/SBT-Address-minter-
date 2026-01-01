export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress' as `0x${string}`;

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'city',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'country',
        type: 'string',
      },
    ],
    name: 'AddressMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'MetadataUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MINT_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTokenMetadata',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'street',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'city',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'state',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'country',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'postalCode',
            type: 'string',
          },
          {
            internalType: 'int256',
            name: 'latitude',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'longitude',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'mintedAt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'additionalInfo',
            type: 'string',
          },
        ],
        internalType: 'struct DeliveryAddressSBT.LocationMetadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'getTokensByOwner',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'street',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'city',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'state',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'country',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'postalCode',
                type: 'string',
              },
              {
                internalType: 'int256',
                name: 'latitude',
                type: 'int256',
              },
              {
                internalType: 'int256',
                name: 'longitude',
                type: 'int256',
              },
              {
                internalType: 'uint256',
                name: 'mintedAt',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'additionalInfo',
                type: 'string',
              },
            ],
            internalType: 'struct DeliveryAddressSBT.LocationMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct DeliveryAddressSBT.LazyMintVoucher',
        name: 'voucher',
        type: 'tuple',
      },
    ],
    name: 'lazyMint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'street',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'city',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'state',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'country',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'postalCode',
            type: 'string',
          },
          {
            internalType: 'int256',
            name: 'latitude',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'longitude',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'mintedAt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'additionalInfo',
            type: 'string',
          },
        ],
        internalType: 'struct DeliveryAddressSBT.LocationMetadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'mintAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'street',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'city',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'state',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'country',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'postalCode',
            type: 'string',
          },
          {
            internalType: 'int256',
            name: 'latitude',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'longitude',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'mintedAt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'additionalInfo',
            type: 'string',
          },
        ],
        internalType: 'struct DeliveryAddressSBT.LocationMetadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
