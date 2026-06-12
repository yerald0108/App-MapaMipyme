import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../constants/config';

export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);