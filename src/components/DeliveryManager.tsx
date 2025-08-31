import React, { useState } from 'react';
import { DeliveryPoint } from '../types';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle,
  FileDown,
  Upload
} from 'lucide-react';

interface DeliveryManagerProps {
  deliveryPoints: DeliveryPoint[];
  onAddPoint: (point: Omit<DeliveryPoint, 'id'>) => void;
  onRemovePoint: (id: string) => void;
  onBulkImport: (points: DeliveryPoint[]) => void;
}

export default function DeliveryManager({ 
  deliveryPoints, 
  onAddPoint, 
  onRemovePoint,
  onBulkImport 
}: DeliveryManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPoint, setNewPoint] = useState({
    address: '',
    priority: 'medium' as const,
    estimatedDuration: 15
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.address.trim()) return;
    
    onAddPoint({
      ...newPoint,
      coordinates: {
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50
      }
    });
    
    setNewPoint({ address: '', priority: 'medium', estimatedDuration: 15 });
    setShowAddForm(false);
  };

  const handleBulkImport = () => {
    const samplePoints: DeliveryPoint[] = [
      {
        id: 'sample-1',
        address: '123 Commerce St, Downtown',
        coordinates: { x: 200, y: 150 },
        priority: 'high',
        estimatedDuration: 20
      },
      {
        id: 'sample-2',
        address: '456 Business Ave, Midtown',
        coordinates: { x: 400, y: 300 },
        priority: 'medium',
        estimatedDuration: 15
      },
      {
        id: 'sample-3',
        address: '789 Industrial Blvd, Suburbs',
        coordinates: { x: 600, y: 450 },
        priority: 'low',
        estimatedDuration: 10
      },
      {
        id: 'sample-4',
        address: '321 Tech Park Dr, North',
        coordinates: { x: 300, y: 100 },
        priority: 'high',
        estimatedDuration: 25
      },
      {
        id: 'sample-5',
        address: '654 Retail Plaza, East',
        coordinates: { x: 500, y: 200 },
        priority: 'medium',
        estimatedDuration: 18
      }
    ];
    
    onBulkImport(samplePoints);
  };

  const exportPoints = () => {
    const dataStr = JSON.stringify(deliveryPoints, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'delivery-points.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-green-400 bg-green-900/20';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Delivery Points</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkImport}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm 
                     transition-colors flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            Import Sample
          </button>
          <button
            onClick={exportPoints}
            disabled={deliveryPoints.length === 0}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed
                     text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1"
          >
            <FileDown className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
      
      {/* Add Point Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg 
                   font-medium transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          Add Delivery Point
        </button>
      )}
      
      {/* Add Point Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">Address</label>
              <input
                type="text"
                value={newPoint.address}
                onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                placeholder="Enter delivery address..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white 
                         placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Priority</label>
                <select
                  value={newPoint.priority}
                  onChange={(e) => setNewPoint({ ...newPoint, priority: e.target.value as any })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white 
                           focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={newPoint.estimatedDuration}
                  onChange={(e) => setNewPoint({ ...newPoint, estimatedDuration: parseInt(e.target.value) })}
                  min="5"
                  max="120"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white 
                           focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md 
                         font-medium transition-colors flex-1"
              >
                Add Point
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md 
                         font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Points List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {deliveryPoints.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No delivery points added yet</p>
            <p className="text-gray-500 text-xs">Click "Add Delivery Point" or "Import Sample" to get started</p>
          </div>
        ) : (
          deliveryPoints.map(point => (
            <div 
              key={point.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700
                       hover:border-gray-600 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{point.address}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(point.priority)}`}>
                    {point.priority}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{point.estimatedDuration}m</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onRemovePoint(point.id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}