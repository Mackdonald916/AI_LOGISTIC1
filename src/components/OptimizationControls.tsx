import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Zap, 
  Brain,
  GitBranch,
  Target
} from 'lucide-react';

interface OptimizationControlsProps {
  onOptimize: (algorithm: string) => void;
  onReset: () => void;
  onAddDisruption: () => void;
  isOptimizing: boolean;
}

export default function OptimizationControls({ 
  onOptimize, 
  onReset, 
  onAddDisruption,
  isOptimizing 
}: OptimizationControlsProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('ml_adaptive');

  const algorithms = [
    {
      id: 'dijkstra',
      name: 'Dijkstra',
      description: 'Shortest path algorithm',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      id: 'astar',
      name: 'A* Search',
      description: 'Heuristic pathfinding',
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      id: 'genetic',
      name: 'Genetic Algorithm',
      description: 'Evolutionary optimization',
      icon: GitBranch,
      color: 'text-purple-400'
    },
    {
      id: 'ml_adaptive',
      name: 'ML Adaptive',
      description: 'AI-powered optimization',
      icon: Brain,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Optimization Engine</h3>
      </div>
      
      {/* Algorithm Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mb-3 block">
          Select Algorithm
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {algorithms.map(algorithm => {
            const Icon = algorithm.icon;
            return (
              <button
                key={algorithm.id}
                onClick={() => setSelectedAlgorithm(algorithm.id)}
                className={`p-3 rounded-lg border text-left transition-all hover:border-gray-500 ${
                  selectedAlgorithm === algorithm.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${algorithm.color}`} />
                  <span className="text-sm font-medium text-white">{algorithm.name}</span>
                </div>
                <p className="text-xs text-gray-400">{algorithm.description}</p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => onOptimize(selectedAlgorithm)}
          disabled={isOptimizing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed
                   text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Optimizing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Optimize Routes
            </>
          )}
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddDisruption}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium 
                     transition-colors flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Add Disruption
          </button>
          
          <button
            onClick={onReset}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium 
                     transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Algorithm Info */}
      {selectedAlgorithm && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-white mb-2">Algorithm Details</h4>
          {selectedAlgorithm === 'ml_adaptive' && (
            <div className="space-y-2 text-xs text-gray-400">
              <p>• Reinforcement learning for real-time adaptation</p>
              <p>• Historical data pattern recognition</p>
              <p>• Dynamic weight adjustment based on conditions</p>
            </div>
          )}
          {selectedAlgorithm === 'genetic' && (
            <div className="space-y-2 text-xs text-gray-400">
              <p>• Population-based optimization</p>
              <p>• Multi-objective fitness evaluation</p>
              <p>• Crossover and mutation operations</p>
            </div>
          )}
          {selectedAlgorithm === 'astar' && (
            <div className="space-y-2 text-xs text-gray-400">
              <p>• Heuristic-guided pathfinding</p>
              <p>• Priority-based route selection</p>
              <p>• Optimal path guarantee</p>
            </div>
          )}
          {selectedAlgorithm === 'dijkstra' && (
            <div className="space-y-2 text-xs text-gray-400">
              <p>• Shortest path computation</p>
              <p>• Guaranteed optimal solutions</p>
              <p>• Foundation for complex algorithms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}