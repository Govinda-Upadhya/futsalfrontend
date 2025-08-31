export interface Ground {
  _id: number;
  name: string;
  type: "Football" | "Cricket" | "Basketball" | "Tennis" | "Badminton";
  location: string;
  pricePerHour: number;
  rating: number;
  features: string[];
  image: string;
  description: string;
  availability: string[];
}

export interface Booking {
  id: number;
  groundId: number;
  groundName: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
}

export const base_url = "http://localhost:3001";
