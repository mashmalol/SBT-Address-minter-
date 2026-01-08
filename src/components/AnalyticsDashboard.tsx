import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { 
  TrendingUp, 
  Globe, 
  Coins, 
  Award, 
  MapPin, 
  Activity,
  BarChart3,
  PieChart,
  ArrowLeft,
  Users,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AnalyticsData {
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

interface GlobalStats {
  totalMints: number;
  totalValue: number;
  topCountries: Array<{ name: string; mints: number }>;
  averagePrice: number;
  growthRate: number;
  chainDistribution: Array<{ chain: string; percentage: number }>;
}

export const AnalyticsDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<'personal' | 'global'>('personal');
  const [loading, setLoading] = useState(false);

  // Mock data - will be replaced with real API calls
  const userAnalytics: AnalyticsData = {
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

  const globalStats: GlobalStats = {
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" icon={<ArrowLeft className="w-5 h-5" />}>
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600">Track your portfolio and global statistics</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'personal'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Personal
            </div>
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'global'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'personal' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="success">+12%</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Addresses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{userAnalytics.totalAddresses}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="info">ETH</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${userAnalytics.portfolioValue.toLocaleString()}
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Ad Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${userAnalytics.adRevenue.toFixed(2)}
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <Badge>ADDR</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Token Balance</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {userAnalytics.addrBalance.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Cities */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Top Cities</h3>
                    <p className="text-sm text-gray-600">Your most minted locations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAnalytics.topCities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{city.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${(city.count / userAnalytics.totalAddresses) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8">{city.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continent Coverage */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Continent Coverage</h3>
                    <p className="text-sm text-gray-600">{userAnalytics.continentCoverage} of 7 continents</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'].map((continent, index) => {
                    const hasAddress = index < userAnalytics.continentCoverage;
                    return (
                      <div key={continent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{continent}</span>
                        {hasAddress ? (
                          <Badge variant="success">✓ Covered</Badge>
                        ) : (
                          <Badge>Not yet</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Mints</h3>
                  <p className="text-sm text-gray-600">Your latest address NFTs</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userAnalytics.recentMints.map((mint) => (
                  <div key={mint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{mint.city}, {mint.country}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(mint.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={mint.tier === 'EXCLUSIVE' ? 'warning' : 'default'}>
                      {mint.tier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'global' && (
        <>
          {/* Global Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="success">+{globalStats.growthRate}%</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Mints Globally</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {globalStats.totalMints.toLocaleString()}
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="info">USD</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${globalStats.totalValue.toLocaleString()}
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <Badge>AVG</Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">Average Mint Price</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${globalStats.averagePrice.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Global Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Top Countries</h3>
                    <p className="text-sm text-gray-600">Most active regions worldwide</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalStats.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${(country.mints / globalStats.totalMints) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12">{country.mints}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chain Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Chain Distribution</h3>
                    <p className="text-sm text-gray-600">Mints across different networks</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {globalStats.chainDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        <span className="font-medium text-gray-900">{item.chain}</span>
                      </div>
                      <Badge>{item.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
