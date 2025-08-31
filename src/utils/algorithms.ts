import { DeliveryPoint, Vehicle, Route, Disruption, AlgorithmResult } from '../types';

// Simulated Dijkstra's Algorithm for shortest path
export function dijkstraOptimization(
  points: DeliveryPoint[],
  vehicles: Vehicle[],
  disruptions: Disruption[] = []
): AlgorithmResult {
  const startTime = performance.now();
  
  // Simple greedy assignment with distance calculation
  const routes: Route[] = vehicles.map(vehicle => {
    const assignedPoints = points.slice(0, Math.ceil(points.length / vehicles.length));
    const totalDistance = calculateTotalDistance(assignedPoints, disruptions);
    
    return {
      vehicleId: vehicle.id,
      points: assignedPoints,
      totalDistance,
      estimatedTime: totalDistance * 2.5, // 2.5 minutes per km
      fuelCost: totalDistance * 0.15 // $0.15 per km
    };
  });

  const metrics = calculateMetrics(routes);
  const computationTime = performance.now() - startTime;

  return {
    algorithm: 'dijkstra',
    routes,
    metrics,
    computationTime
  };
}

// Simulated A* Algorithm with heuristic optimization
export function astarOptimization(
  points: DeliveryPoint[],
  vehicles: Vehicle[],
  disruptions: Disruption[] = []
): AlgorithmResult {
  const startTime = performance.now();
  
  // A* with priority-based heuristic
  const priorityPoints = [...points].sort((a, b) => {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return priorityMap[b.priority] - priorityMap[a.priority];
  });

  const routes: Route[] = vehicles.map((vehicle, index) => {
    const vehiclePoints = priorityPoints.filter((_, i) => i % vehicles.length === index);
    const optimizedPoints = optimizePointOrder(vehiclePoints);
    const totalDistance = calculateTotalDistance(optimizedPoints, disruptions);
    
    return {
      vehicleId: vehicle.id,
      points: optimizedPoints,
      totalDistance,
      estimatedTime: totalDistance * 2.2, // 10% faster than Dijkstra
      fuelCost: totalDistance * 0.14
    };
  });

  const metrics = calculateMetrics(routes);
  const computationTime = performance.now() - startTime;

  return {
    algorithm: 'astar',
    routes,
    metrics,
    computationTime
  };
}

// Simulated Genetic Algorithm for global optimization
export function geneticOptimization(
  points: DeliveryPoint[],
  vehicles: Vehicle[],
  disruptions: Disruption[] = []
): AlgorithmResult {
  const startTime = performance.now();
  
  // Genetic algorithm simulation with multiple generations
  let bestSolution = generateRandomSolution(points, vehicles);
  
  // Simulate 50 generations
  for (let generation = 0; generation < 50; generation++) {
    const population = generatePopulation(points, vehicles, 20);
    const fittest = population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
    
    if (fittest.fitness > bestSolution.fitness) {
      bestSolution = fittest;
    }
  }

  const routes: Route[] = bestSolution.routes.map(route => ({
    ...route,
    totalDistance: calculateTotalDistance(route.points, disruptions),
    estimatedTime: calculateTotalDistance(route.points, disruptions) * 2.0, // 20% faster
    fuelCost: calculateTotalDistance(route.points, disruptions) * 0.12
  }));

  const metrics = calculateMetrics(routes);
  const computationTime = performance.now() - startTime;

  return {
    algorithm: 'genetic',
    routes,
    metrics,
    computationTime
  };
}

// ML Adaptive Algorithm (reinforcement learning simulation)
export function mlAdaptiveOptimization(
  points: DeliveryPoint[],
  vehicles: Vehicle[],
  disruptions: Disruption[] = [],
  historicalData?: any[]
): AlgorithmResult {
  const startTime = performance.now();
  
  // Simulate reinforcement learning with adaptive weights
  const adaptiveWeights = {
    distance: 0.4,
    traffic: 0.3,
    priority: 0.2,
    fuelEfficiency: 0.1
  };

  // Apply machine learning insights
  const routes: Route[] = vehicles.map((vehicle, index) => {
    const vehiclePoints = distributePointsIntelligently(points, vehicles, index, adaptiveWeights);
    const optimizedPoints = applyMLOptimization(vehiclePoints, disruptions);
    const totalDistance = calculateTotalDistance(optimizedPoints, disruptions);
    
    return {
      vehicleId: vehicle.id,
      points: optimizedPoints,
      totalDistance,
      estimatedTime: totalDistance * 1.8, // 25% faster with ML
      fuelCost: totalDistance * 0.11
    };
  });

  const metrics = calculateMetrics(routes);
  const computationTime = performance.now() - startTime;

  return {
    algorithm: 'ml_adaptive',
    routes,
    metrics,
    computationTime
  };
}

// Utility functions
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function calculateTotalDistance(points: DeliveryPoint[], disruptions: Disruption[] = []): number {
  if (points.length < 2) return 0;
  
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    let distance = calculateDistance(points[i].coordinates, points[i + 1].coordinates);
    
    // Apply disruption impacts
    disruptions.forEach(disruption => {
      const distanceToDisruption = calculateDistance(points[i].coordinates, disruption.location);
      if (distanceToDisruption <= disruption.radius) {
        distance *= disruption.impact;
      }
    });
    
    total += distance;
  }
  return total;
}

function optimizePointOrder(points: DeliveryPoint[]): DeliveryPoint[] {
  // Simple nearest neighbor heuristic
  if (points.length <= 1) return points;
  
  const optimized = [points[0]];
  const remaining = points.slice(1);
  
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(current.coordinates, remaining[0].coordinates);
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(current.coordinates, remaining[i].coordinates);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }
  
  return optimized;
}

function generateRandomSolution(points: DeliveryPoint[], vehicles: Vehicle[]) {
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  const routes = vehicles.map((vehicle, index) => ({
    vehicleId: vehicle.id,
    points: shuffled.filter((_, i) => i % vehicles.length === index),
    totalDistance: 0,
    estimatedTime: 0,
    fuelCost: 0
  }));
  
  return {
    routes,
    fitness: calculateFitness(routes)
  };
}

function generatePopulation(points: DeliveryPoint[], vehicles: Vehicle[], size: number) {
  return Array.from({ length: size }, () => generateRandomSolution(points, vehicles));
}

function calculateFitness(routes: Route[]): number {
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  return 1 / (1 + totalDistance); // Higher fitness for shorter total distance
}

function distributePointsIntelligently(
  points: DeliveryPoint[], 
  vehicles: Vehicle[], 
  vehicleIndex: number,
  weights: any
): DeliveryPoint[] {
  // Simulate ML-based intelligent distribution
  const vehiclePoints: DeliveryPoint[] = [];
  const pointsPerVehicle = Math.ceil(points.length / vehicles.length);
  
  const startIndex = vehicleIndex * pointsPerVehicle;
  const endIndex = Math.min(startIndex + pointsPerVehicle, points.length);
  
  return points.slice(startIndex, endIndex);
}

function applyMLOptimization(points: DeliveryPoint[], disruptions: Disruption[]): DeliveryPoint[] {
  // Simulate reinforcement learning optimization
  return optimizePointOrder(points);
}

function calculateMetrics(routes: Route[]): any {
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const totalTime = routes.reduce((sum, route) => sum + route.estimatedTime, 0);
  const totalFuelCost = routes.reduce((sum, route) => sum + route.fuelCost, 0);
  
  // Baseline comparison (20% improvement simulation)
  const baselineDistance = totalDistance * 1.2;
  const baselineFuelCost = totalFuelCost * 1.2;
  
  return {
    totalDistance: Math.round(totalDistance),
    totalTime: Math.round(totalTime),
    fuelSavings: Math.round(baselineFuelCost - totalFuelCost),
    carbonReduction: Math.round((baselineDistance - totalDistance) * 0.21), // kg CO2
    efficiency: Math.round(((baselineDistance - totalDistance) / baselineDistance) * 100)
  };
}