import React, { useState, useEffect } from 'react';
import { DeliveryPoint, Vehicle, Disruption } from '../types';
import { Navigation, MapPin, Truck, AlertTriangle, Cloud, TrafficCone as Traffic } from 'lucide-react';

interface MapProps {
  deliveryPoints: DeliveryPoint[];
  vehicles: Vehicle[];
  disruptions: Disruption[];
  onPointClick?: (point: DeliveryPoint) => void;
  onMapClick?: (coordinates: { x: number; y: number }) => void;
}

export default function Map({ 
  deliveryPoints, 
  vehicles, 
  disruptions, 
  onPointClick, 
  onMapClick 
}: MapProps) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMapClick = (event: React.MouseEvent<SVGElement>) => {
    if (!onMapClick) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 800;
    const y = ((event.clientY - rect.top) / rect.height) * 600;
    
    onMapClick({ x, y });
  };

  const getDisruptionIcon = (type: string) => {
    switch (type) {
      case 'traffic': return Traffic;
      case 'weather': return Cloud;
      default: return AlertTriangle;
    }
  };

  const getDisruptionColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Route Visualization</h3>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <svg 
          width="100%" 
          height="400" 
          viewBox="0 0 800 600" 
          className="border border-gray-600 rounded cursor-crosshair"
          onClick={handleMapClick}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Vehicle routes */}
          {vehicles.map(vehicle => (
            vehicle.route.length > 1 && (
              <g key={`route-${vehicle.id}`}>
                <path
                  d={`M ${vehicle.position.x} ${vehicle.position.y} ${vehicle.route.map(point => 
                    `L ${point.coordinates.x} ${point.coordinates.y}`
                  ).join(' ')}`}
                  stroke={vehicle.color}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </g>
            )
          ))}
          
          {/* Disruptions */}
          {disruptions.map(disruption => {
            const Icon = getDisruptionIcon(disruption.type);
            return (
              <g key={disruption.id}>
                <circle
                  cx={disruption.location.x}
                  cy={disruption.location.y}
                  r={disruption.radius}
                  fill={getDisruptionColor(disruption.severity)}
                  opacity="0.2"
                  className="animate-pulse"
                />
                <circle
                  cx={disruption.location.x}
                  cy={disruption.location.y}
                  r="8"
                  fill={getDisruptionColor(disruption.severity)}
                />
                <foreignObject
                  x={disruption.location.x - 6}
                  y={disruption.location.y - 6}
                  width="12"
                  height="12"
                >
                  <Icon className="w-3 h-3 text-white" />
                </foreignObject>
              </g>
            );
          })}
          
          {/* Delivery points */}
          {deliveryPoints.map(point => (
            <g 
              key={point.id} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onPointClick?.(point)}
            >
              <circle
                cx={point.coordinates.x}
                cy={point.coordinates.y}
                r="8"
                fill={getPriorityColor(point.priority)}
                stroke="#1F2937"
                strokeWidth="2"
              />
              <foreignObject
                x={point.coordinates.x - 6}
                y={point.coordinates.y - 6}
                width="12"
                height="12"
              >
                <MapPin className="w-3 h-3 text-white" />
              </foreignObject>
            </g>
          ))}
          
          {/* Vehicles */}
          {vehicles.map(vehicle => {
            const animatedX = vehicle.position.x + Math.sin(animationFrame * 0.1) * 2;
            const animatedY = vehicle.position.y + Math.cos(animationFrame * 0.1) * 2;
            
            return (
              <g key={vehicle.id}>
                <circle
                  cx={animatedX}
                  cy={animatedY}
                  r="12"
                  fill={vehicle.color}
                  stroke="#1F2937"
                  strokeWidth="3"
                />
                <foreignObject
                  x={animatedX - 8}
                  y={animatedY - 8}
                  width="16"
                  height="16"
                >
                  <Truck className="w-4 h-4 text-white" />
                </foreignObject>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300">Vehicles</span>
          </div>
        </div>
      </div>
    </div>
  );
}