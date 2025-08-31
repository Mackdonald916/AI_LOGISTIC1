import { DeliveryPoint, Vehicle } from '../types';

export function generateSampleVehicles(): Vehicle[] {
  return [
    {
      id: 'vehicle-1',
      name: 'Truck Alpha',
      capacity: 50,
      currentLoad: 0,
      status: 'idle',
      position: { x: 100, y: 100 },
      route: [],
      color: '#3B82F6'
    },
    {
      id: 'vehicle-2',
      name: 'Van Beta',
      capacity: 30,
      currentLoad: 0,
      status: 'idle',
      position: { x: 150, y: 150 },
      route: [],
      color: '#10B981'
    },
    {
      id: 'vehicle-3',
      name: 'Truck Gamma',
      capacity: 45,
      currentLoad: 0,
      status: 'idle',
      position: { x: 200, y: 120 },
      route: [],
      color: '#F59E0B'
    }
  ];
}

export function generateSampleDeliveryPoints(): DeliveryPoint[] {
  const addresses = [
    'Downtown Business Center',
    'Riverside Shopping Mall',
    'Tech Campus North',
    'Industrial District',
    'Suburban Plaza',
    'Airport Commerce Hub',
    'University District',
    'Medical Center Complex'
  ];

  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  return addresses.map((address, index) => ({
    id: `point-${index + 1}`,
    address,
    coordinates: {
      x: 150 + (index % 3) * 200 + Math.random() * 100,
      y: 150 + Math.floor(index / 3) * 150 + Math.random() * 80
    },
    priority: priorities[index % 3],
    estimatedDuration: 10 + Math.floor(Math.random() * 20)
  }));
}

export function updateVehiclePositions(
  vehicles: Vehicle[],
  algorithmResult: any
): Vehicle[] {
  return vehicles.map(vehicle => {
    const route = algorithmResult?.routes.find((r: any) => r.vehicleId === vehicle.id);
    if (!route || route.points.length === 0) return vehicle;

    return {
      ...vehicle,
      route: route.points,
      status: 'delivering' as const,
      currentLoad: route.points.length * 5 // Simulate load
    };
  });
}