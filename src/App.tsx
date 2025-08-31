import React, { useState, useEffect } from 'react';
import { DeliveryPoint, Vehicle, Disruption, OptimizationMetrics } from './types';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import VehiclePanel from './components/VehiclePanel';
import OptimizationControls from './components/OptimizationControls';
import DeliveryManager from './components/DeliveryManager';
import DisruptionSimulator from './components/DisruptionSimulator';
import useOptimization from './hooks/useOptimization';
import { generateSampleVehicles, updateVehiclePositions } from './utils/dataGenerator';
import { Route, Zap, Truck } from 'lucide-react';

function App() {
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(generateSampleVehicles());
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    totalDistance: 0,
    totalTime: 0,
    fuelSavings: 0,
    carbonReduction: 0,
    efficiency: 0
  });

  const { optimize, isOptimizing, currentResult } = useOptimization();

  useEffect(() => {
    if (currentResult) {
      setMetrics(currentResult.metrics);
      setVehicles(prevVehicles => updateVehiclePositions(prevVehicles, currentResult));
    }
  }, [currentResult]);

  const handleOptimize = async (algorithm: string) => {
    await optimize(algorithm, deliveryPoints, vehicles, disruptions);
  };

  const handleAddPoint = (point: Omit<DeliveryPoint, 'id'>) => {
    const newPoint: DeliveryPoint = {
      ...point,
      id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setDeliveryPoints(prev => [...prev, newPoint]);
  };

  const handleRemovePoint = (id: string) => {
    setDeliveryPoints(prev => prev.filter(point => point.id !== id));
  };

  const handleBulkImport = (points: DeliveryPoint[]) => {
    setDeliveryPoints(points);
  };

  const handleAddDisruption = (disruption: Omit<Disruption, 'id'>) => {
    const newDisruption: Disruption = {
      ...disruption,
      id: `disruption-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setDisruptions(prev => [...prev, newDisruption]);
    
    // Auto-remove disruption after its duration
    setTimeout(() => {
      setDisruptions(prev => prev.filter(d => d.id !== newDisruption.id));
    }, newDisruption.duration * 1000);
  };

  const handleRemoveDisruption = (id: string) => {
    setDisruptions(prev => prev.filter(disruption => disruption.id !== id));
  };

  const handleMapClick = (coordinates: { x: number; y: number }) => {
    handleAddPoint({
      address: `Custom Location (${Math.round(coordinates.x)}, ${Math.round(coordinates.y)})`,
      coordinates,
      priority: 'medium',
      estimatedDuration: 15
    });
  };

  const handleReset = () => {
    setDeliveryPoints([]);
    setDisruptions([]);
    setVehicles(generateSampleVehicles());
    setMetrics({
      totalDistance: 0,
      totalTime: 0,
      fuelSavings: 0,
      carbonReduction: 0,
      efficiency: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Route className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SmartRoute</h1>
              <p className="text-sm text-gray-400">AI-Powered Logistics Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-green-400" />
              <span>Real-time ML Engine</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>{vehicles.length} Active Vehicles</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Dashboard */}
        <Dashboard 
          metrics={metrics} 
          algorithmResult={currentResult} 
          isOptimizing={isOptimizing}
          vehicles={vehicles}
          disruptions={disruptions}
          deliveryPoints={deliveryPoints}
        />
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <OptimizationControls
              onOptimize={handleOptimize}
              onReset={handleReset}
              onAddDisruption={() => handleAddDisruption({
                type: 'traffic',
                severity: 'medium',
                location: { x: Math.random() * 700 + 50, y: Math.random() * 500 + 50 },
                radius: 50,
                duration: 120,
                impact: 1.8
              })}
              isOptimizing={isOptimizing}
            />
            
            <DisruptionSimulator
              disruptions={disruptions}
              onAddDisruption={handleAddDisruption}
              onRemoveDisruption={handleRemoveDisruption}
            />
          </div>
          
          {/* Center Column - Map */}
          <div className="lg:col-span-1">
            <Map
              deliveryPoints={deliveryPoints}
              vehicles={vehicles}
              disruptions={disruptions}
              onMapClick={handleMapClick}
            />
          </div>
          
          {/* Right Column - Management */}
          <div className="space-y-6">
            <VehiclePanel vehicles={vehicles} />
            
            <DeliveryManager
              deliveryPoints={deliveryPoints}
              onAddPoint={handleAddPoint}
              onRemovePoint={handleRemovePoint}
              onBulkImport={handleBulkImport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;