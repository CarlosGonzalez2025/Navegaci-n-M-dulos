import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uorsdalprrserlainmpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcnNkYWxwcnJzZXJsYWlubXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTQxNTMsImV4cCI6MjA3NzkzMDE1M30.lmghJK_0efyGPk5VBVj4Lff7pMYt3zf3gDj94z2QmX0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
