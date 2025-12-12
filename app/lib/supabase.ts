// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Usar valores por defecto durante el build si las variables de entorno no están disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
