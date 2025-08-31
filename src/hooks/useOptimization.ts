import { useState, useCallback } from 'react';
import { DeliveryPoint, Vehicle, Disruption, AlgorithmResult } from '../types';
import { 
  dijkstraOptimization, 
  astarOptimization, 
  geneticOptimization, 
  mlAdaptiveOptimization 
} from '../utils/algorithms';

export default function useOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AlgorithmResult | null>(null);

  const optimize = useCallback(async (
    algorithm: string,
    points: DeliveryPoint[],
    vehicles: Vehicle[],
    disruptions: Disruption[] = []
  ) => {
    if (points.length === 0 || vehicles.length === 0) return;
    
    setIsOptimizing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    let result: AlgorithmResult;
    
    switch (algorithm) {
      case 'dijkstra':
        result = dijkstraOptimization(points, vehicles, disruptions);
        break;
      case 'astar':
        result = astarOptimization(points, vehicles, disruptions);
        break;
      case 'genetic':
        result = geneticOptimization(points, vehicles, disruptions);
        break;
      case 'ml_adaptive':
        result = mlAdaptiveOptimization(points, vehicles, disruptions);
        break;
      default:
        result = mlAdaptiveOptimization(points, vehicles, disruptions);
    }
    
    setCurrentResult(result);
    setIsOptimizing(false);
    
    return result;
  }, []);

  return {
    optimize,
    isOptimizing,
    currentResult
  };
}