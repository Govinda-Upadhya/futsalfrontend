export interface Ground {
  _id: string;
  name: string;
  type: "Football" | "Cricket" | "Basketball" | "Tennis" | "Badminton";
  location: string;
  pricePerHour: number;
  nightprice: number;
  rating: number;
  features: string[];
  image: string;
  description: string;
  availability: string[];
}

export interface Booking {
  _id: string; // MongoDB ObjectId as string

  email: string;
  name?: string;
  contact: string;

  amount: number;
  date: string | Date;

  time: {
    start: string; // e.g., "07:00"
    end: string; // e.g., "08:00"
  }[];

  booking_orderNo: string;

  payment_status: "SUCCESS" | "FAILURE" | "CANCELLED" | "PENDING";

  ground: string; // ObjectId reference to Ground

  expiresAt: string | Date;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Admin {
  name: string;
  email: string;
  profile?: string;
  contact: string;
  password: string;
  scanner: string;
}
export const base_url = "/api";
export const upload_base_url = "/api/photo";
