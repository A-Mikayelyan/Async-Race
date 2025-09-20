


export type SortOrder = "ASC" | "DESC";
export type SortKey = "wins" | "time" | "id" | "name";


export type Winner = {
 
  id: number;
  wins: number;
  
  time: number;
};

export type WinnerView = {
  
  id: number;
  wins: number;
  time: number;
  
  name: string;
  color: string;
};


export type CarEntity = {
  id: number;
  name: string;
  color: string;
};


export type Car = CarEntity;


export type Paginated<T> = {
  items: T[];
  total: number; 
};


export type PaginatedQuery = {
  page: number;   
  limit: number;
  sort?: string;
  order?: SortOrder;
};
