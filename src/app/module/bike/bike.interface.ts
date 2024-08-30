export interface IBike {
  name: string;
  description: string;
  pricePerHour: number;
  isAvailable?: boolean;
  imageUrl: string;
  cc: number;
  year: number;
  model: string;
  brand: string;
}
