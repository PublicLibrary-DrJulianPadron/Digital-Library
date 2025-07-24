export type Profile = {
  id: string;
  is_active: boolean;
  address?: string | null;
  age?: number | null;
  phone?: string | null;
  active_loans?: number;
  total_books_loaned?: number;
  last_activity?: string | null;
};


export type ProfilesRow = Profile &{
  created_at: string;
  updated_at: string;
};

export type ProfilesInsert = Partial<Profile>;

export type ProfilesUpdate = Partial<Profile>;