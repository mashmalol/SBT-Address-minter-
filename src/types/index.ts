export interface LocationMetadata {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  mintedAt?: number;
  additionalInfo?: string;
  tier?: number;
  elevation?: number;
  populationDensity?: number;
}

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface AddressData extends LocationMetadata {
  formattedAddress: string;
}

export interface LazyMintVoucher {
  tokenId: number;
  minter: string;
  metadata: LocationMetadata;
  signature: string;
}

export interface Token {
  tokenId: number;
  metadata: LocationMetadata;
  owner: string;
}
