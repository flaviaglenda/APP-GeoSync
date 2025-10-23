import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://nmiwzrpxkoetswthjqjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taXd6cnB4a29ldHN3dGhqcWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTcwNDksImV4cCI6MjA3MzE5MzA0OX0.8JBb9HWqP2T-RKHnHANve0fOeZsV5nR5ykPFhgMRcXw';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL ou Anon Key não estão definidos.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);