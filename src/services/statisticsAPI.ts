import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface UserAnalytics {
  totalAddresses: number;
  portfolioValue: number;
  adRevenue: number;
  addrBalance: number;
  topCities: Array<{ name: string; count: number }>;
  continentCoverage: number;
  rarityScore: number;
  recentMints: Array<{
    id: number;
    city: string;
    country: string;
    tier: string;
    timestamp: number;
  }>;
}

export interface GlobalStats {
  totalMints: number;
  totalValue: number;
  topCountries: Array<{ name: string; mints: number }>;
  averagePrice: number;
  growthRate: number;
  chainDistribution: Array<{ chain: string; percentage: number }>;
}

export interface CityStats {
  cityName: string;
  totalMints: number;
  averagePrice: number;
  topTier: string;
}

export interface CountryStats {
  countryCode: string;
  countryName: string;
  totalMints: number;
  averagePrice: number;
  popularCities: string[];
}

export interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
}

class StatisticsAPI {
  /**
   * Get analytics for a specific user
   */
  async getUserAnalytics(address: string): Promise<UserAnalytics> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/user/${address}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      // Return mock data for now
      return this.getMockUserAnalytics();
    }
  }

  /**
   * Get global platform statistics
   */
  async getGlobalStats(): Promise<GlobalStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/global`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
      // Return mock data for now
      return this.getMockGlobalStats();
    }
  }

  /**
   * Get statistics for a specific city
   */
  async getCityStats(cityName: string): Promise<CityStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/city/${encodeURIComponent(cityName)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch city stats:', error);
      throw error;
    }
  }

  /**
   * Get statistics for a specific country
   */
  async getCountryStats(countryCode: string): Promise<CountryStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/country/${countryCode}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch country stats:', error);
      throw error;
    }
  }

  /**
   * Get heatmap data for visualization
   */
  async getHeatmapData(zoom: number, lat: number, lng: number): Promise<HeatmapData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/heatmap/${zoom}/${lat}/${lng}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      return [];
    }
  }

  /**
   * Get chain-specific statistics
   */
  async getChainStats(chainId: number): Promise<{
    chainId: number;
    chainName: string;
    totalMints: number;
    totalValue: number;
    averageGasPrice: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/chain/${chainId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chain stats:', error);
      throw error;
    }
  }

  // Mock data methods (will be removed when backend is ready)
  private getMockUserAnalytics(): UserAnalytics {
    return {
      totalAddresses: 12,
      portfolioValue: 2450,
      adRevenue: 45.75,
      addrBalance: 1200,
      topCities: [
        { name: 'New York', count: 5 },
        { name: 'London', count: 3 },
        { name: 'Tokyo', count: 2 },
        { name: 'Paris', count: 1 },
        { name: 'Sydney', count: 1 },
      ],
      continentCoverage: 4,
      rarityScore: 87,
      recentMints: [
        { id: 1, city: 'New York', country: 'USA', tier: 'PREMIUM', timestamp: Date.now() - 86400000 },
        { id: 2, city: 'London', country: 'UK', tier: 'BASIC', timestamp: Date.now() - 172800000 },
        { id: 3, city: 'Tokyo', country: 'Japan', tier: 'EXCLUSIVE', timestamp: Date.now() - 259200000 },
      ],
    };
  }

  private getMockGlobalStats(): GlobalStats {
    return {
      totalMints: 1234,
      totalValue: 567890,
      topCountries: [
        { name: 'United States', mints: 450 },
        { name: 'United Kingdom', mints: 280 },
        { name: 'Japan', mints: 150 },
        { name: 'Germany', mints: 120 },
        { name: 'France', mints: 100 },
      ],
      averagePrice: 32.5,
      growthRate: 24.5,
      chainDistribution: [
        { chain: 'Ethereum', percentage: 45 },
        { chain: 'Polygon', percentage: 30 },
        { chain: 'Base', percentage: 15 },
        { chain: 'Arbitrum', percentage: 10 },
      ],
    };
  }
}

export const statisticsAPI = new StatisticsAPI();
