
export interface Business {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  welcome_stamps?: number;
  welcome_stamps_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
}
