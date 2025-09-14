export type ID = number;

export interface Car {
  name: string;
  color: string; 
}
export interface CarEntity extends Car {
  id: ID;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}
