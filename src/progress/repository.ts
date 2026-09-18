import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase.js';

export interface LessonProgressRow {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface ProgressRepository {
  list(userId: string): Promise<LessonProgressRow[]>;
  upsert(userId: string, lessonId: string, completed: boolean, completedAt: string | null): Promise<void>;
}

export function createSupabaseProgressRepository(client: SupabaseClient): ProgressRepository {
  return {
    async list(userId) {
      const { data, error } = await client
        .from('lesson_progress')
        .select('lesson_id, completed, completed_at')
        .eq('user_id', userId);
      if (error) throw error;
      return (data ?? []).filter((row): row is LessonProgressRow =>
        typeof row.lesson_id === 'string' && typeof row.completed === 'boolean' &&
        (row.completed_at === null || typeof row.completed_at === 'string'));
    },
    async upsert(userId, lessonId, completed, completedAt) {
      const { error } = await client.from('lesson_progress').upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        completed_at: completedAt,
      }, { onConflict: 'user_id,lesson_id' });
      if (error) throw error;
    },
  };
}

export const progressRepository = supabase === null
  ? null
  : createSupabaseProgressRepository(supabase);

