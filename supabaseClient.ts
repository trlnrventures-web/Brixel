
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://ruylzqabzlfdouzdvoap.supabase.co';
const supabaseAnonKey = 'sb_publishable_HyQjoKqtIgpPmRIJ2w-f9A_h904Rnp6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
