import React from 'react';
import { Vehicle, DeliveryPoint } from '../types';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

interface VehiclePanelProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export default function VehiclePanel({ vehicles, onVehicleSelect }: VehiclePanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivering': return 'text-green-400';
      case 'returning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivering': return '🚚';
      case 'returning': return '🔄';
      default: return '⏸️';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Fleet Management</h3>
      </div>
      
      <div className="space-y-3">
        {vehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 
                     cursor-pointer transition-colors"
            onClick={() => onVehicleSelect?.(vehicle)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: vehicle.color }}
                ></div>
                <span className="font-semibold text-white">{vehicle.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getStatusIcon(vehicle.status)}</span>
                <span className={`text-sm ${getStatusColor(vehicle.status)} capitalize`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300">
                  {vehicle.currentLoad}/{vehicle.capacity}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300">{vehicle.route.length} stops</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300">
                  {Math.round(vehicle.route.reduce((sum, point) => sum + point.estimatedDuration, 0))}m
                </span>
              </div>
            </div>
            
            {vehicle.route.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Next Delivery:</p>
                <p className="text-sm text-white truncate">
                  {vehicle.route[0]?.address || 'No upcoming deliveries'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}