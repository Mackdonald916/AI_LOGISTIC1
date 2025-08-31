export interface DeliveryPoint {
  id: string;
  address: string;
  coordinates: { x: number; y: number };
  priority: 'low' | 'medium' | 'high';
  timeWindow?: { start: string; end: string };
  estimatedDuration: number; // minutes
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  status: 'idle' | 'delivering' | 'returning';
  position: { x: number; y: number };
  route: DeliveryPoint[];
  color: string;
}

export interface Route {
  vehicleId: string;
  points: DeliveryPoint[];
  totalDistance: number;
  estimatedTime: number;
  fuelCost: number;
}

export interface OptimizationMetrics {
  totalDistance: number;
  totalTime: number;
  fuelSavings: number;
  carbonReduction: number;
  efficiency: number;
}

export interface Disruption {
  id: string;
  type: 'traffic' | 'weather' | 'road_closure';
  severity: 'low' | 'medium' | 'high';
  location: { x: number; y: number };
  radius: number;
  duration: number; // minutes
  impact: number; // multiplier for delay
}

export interface AlgorithmResult {
  algorithm: 'dijkstra' | 'astar' | 'genetic' | 'ml_adaptive';
  routes: Route[];
  metrics: OptimizationMetrics;
  computationTime: number;
}