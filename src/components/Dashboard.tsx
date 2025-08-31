import React from 'react';
import { OptimizationMetrics, AlgorithmResult, Vehicle, Disruption, DeliveryPoint } from '../types';
import { 
  TrendingUp, 
  Fuel, 
  Clock, 
  Leaf, 
  Activity,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  metrics: OptimizationMetrics;
  algorithmResult?: AlgorithmResult;
  isOptimizing: boolean;
  vehicles: Vehicle[];
  disruptions: Disruption[];
  deliveryPoints: DeliveryPoint[];
}

export default function Dashboard({ 
  metrics, 
  algorithmResult, 
  isOptimizing, 
  vehicles, 
  disruptions, 
  deliveryPoints 
}: DashboardProps) {
  const metricCards = [
    {
      title: 'Efficiency Gain',
      value: `${metrics.efficiency}%`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      change: '+12% vs baseline'
    },
    {
      title: 'Fuel Savings',
      value: `$${metrics.fuelSavings}`,
      icon: Fuel,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      change: `${Math.round(metrics.fuelSavings / 0.15)} km saved`
    },
    {
      title: 'Time Reduction',
      value: `${Math.round(metrics.totalTime / 60)}h`,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      change: '-18% delivery time'
    },
    {
      title: 'CO₂ Reduction',
      value: `${metrics.carbonReduction}kg`,
      icon: Leaf,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      change: 'SDG 13 impact'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.title}
              className={`${metric.bgColor} rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                {isOptimizing && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-gray-400">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Algorithm Performance */}
      {algorithmResult && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Algorithm Performance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Algorithm Used</span>
              </div>
              <p className="text-lg font-semibold text-white capitalize">
                {algorithmResult.algorithm.replace('_', ' ')}
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Computation Time</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {algorithmResult.computationTime.toFixed(2)}ms
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Routes Generated</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {algorithmResult.routes.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Status */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{vehicles.length}</p>
            <p className="text-xs text-gray-400">Active Vehicles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{deliveryPoints.length}</p>
            <p className="text-xs text-gray-400">Delivery Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{disruptions.length}</p>
            <p className="text-xs text-gray-400">Active Disruptions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {isOptimizing ? '...' : '✓'}
            </p>
            <p className="text-xs text-gray-400">Optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}