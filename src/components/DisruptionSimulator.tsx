import React, { useState } from 'react';
import { Disruption } from '../types';
import { AlertTriangle, TrafficCone as Traffic, Cloud, Construction, Plus, Trash2, Activity } from 'lucide-react';

interface DisruptionSimulatorProps {
  disruptions: Disruption[];
  onAddDisruption: (disruption: Omit<Disruption, 'id'>) => void;
  onRemoveDisruption: (id: string) => void;
}

export default function DisruptionSimulator({ 
  disruptions, 
  onAddDisruption, 
  onRemoveDisruption 
}: DisruptionSimulatorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDisruption, setNewDisruption] = useState({
    type: 'traffic' as const,
    severity: 'medium' as const,
    duration: 60
  });

  const disruptionTypes = [
    { id: 'traffic', name: 'Traffic Jam', icon: Traffic, color: 'text-red-400' },
    { id: 'weather', name: 'Bad Weather', icon: Cloud, color: 'text-blue-400' },
    { id: 'road_closure', name: 'Road Closure', icon: Construction, color: 'text-yellow-400' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddDisruption({
      ...newDisruption,
      location: {
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50
      },
      radius: newDisruption.severity === 'high' ? 80 : newDisruption.severity === 'medium' ? 50 : 30,
      impact: newDisruption.severity === 'high' ? 2.5 : newDisruption.severity === 'medium' ? 1.8 : 1.3
    });
    
    setShowAddForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeData = disruptionTypes.find(t => t.id === type);
    return typeData ? typeData.icon : AlertTriangle;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Disruption Simulator</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm 
                   transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Disruption
        </button>
      </div>
      
      {/* Add Disruption Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Disruption Type</label>
              <div className="grid grid-cols-3 gap-2">
                {disruptionTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewDisruption({ ...newDisruption, type: type.id as any })}
                      className={`p-2 rounded-md border text-center transition-all ${
                        newDisruption.type === type.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${type.color}`} />
                      <span className="text-xs text-white">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Severity</label>
                <select
                  value={newDisruption.severity}
                  onChange={(e) => setNewDisruption({ ...newDisruption, severity: e.target.value as any })}
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
                  value={newDisruption.duration}
                  onChange={(e) => setNewDisruption({ ...newDisruption, duration: parseInt(e.target.value) })}
                  min="10"
                  max="480"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white 
                           focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md 
                         font-medium transition-colors flex-1"
              >
                Simulate Disruption
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
      
      {/* Active Disruptions */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {disruptions.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No active disruptions</p>
            <p className="text-gray-500 text-xs">System running optimally</p>
          </div>
        ) : (
          disruptions.map(disruption => {
            const Icon = getTypeIcon(disruption.type);
            return (
              <div 
                key={disruption.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {disruption.type.replace('_', ' ')}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(disruption.severity)}`}>
                        {disruption.severity}
                      </span>
                      <span className="text-xs text-gray-400">{disruption.duration}m</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveDisruption(disruption.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}