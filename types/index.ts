export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: "user" | "organizer" | "admin"
  created_at: string
}

export interface Experience {
  id: string
  slug: string
  title: string
  description: string
  price: number
  duration: string
  category: string
  image_url?: string
  organizer_id: string
  organizer?: User
  is_active: boolean
  created_at: string
}

export interface Reservation {
  id: string
  user_id: string
  experience_id: string
  experience?: Experience
  user?: User
  date: string
  participants: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  experience_id: string
  user?: User
  rating: number
  comment: string
  created_at: string
}
