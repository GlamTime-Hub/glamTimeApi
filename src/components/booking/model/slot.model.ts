export interface Slot {
  date: Date;
  endTime: number;
  fullDate: string;
  professional: {
    businessId: string;
    id: string;
  };
  service: {
    categoryId: string;
    id: string;
    name: string;
    price: number;
    subCategory: string;
  };
  startTime: number;
}
