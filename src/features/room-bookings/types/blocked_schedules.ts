export type BlockedSchedules = {
  id: string;
  description: string | null;
  is_permanent: boolean | null;
  date: string;
  end_time: string;
  start_time: string;
  reason: string;
};

export type BlockedSchedulesRow = BlockedSchedules & {
  created_at: string;
  updated_at: string;
};

export type BlockedSchedulesInsert = Partial<BlockedSchedules>;

export type BlockedSchedulesUpdate = Partial<BlockedSchedules>;