// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Types (adaptés à votre table 'subscribers')
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  source?: string;
  language: string; // ✅ 'language' au lieu de 'lang'
  confirmation_token: string; // ✅ 'confirmation_token' au lieu de 'token'
  confirmed?: boolean;
  subscribed_at?: string;
  confirmed_at?: string;
  created_at?: string;
}

// Fonction : Insérer un nouvel abonné
export async function insertSubscriber(data: NewsletterSubscriber) {
  const { data: result, error } = await supabase
    .from('subscribers') // ✅ Nom de votre table
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

// Fonction : Vérifier si un email existe déjà
export async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscribers') // ✅ Nom de votre table
    .select('email')
    .eq('email', email.toLowerCase())
    .single();

  return !!data && !error;
}

// Fonction : Confirmer un abonné via token
export async function confirmSubscriber(token: string) {
  const { data, error } = await supabase
    .from('subscribers') // ✅ Nom de votre table
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
    })
    .eq('confirmation_token', token) // ✅ 'confirmation_token'
    .eq('confirmed', false) // Empêche les confirmations multiples
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fonction : Récupérer un abonné par token
export async function getSubscriberByToken(token: string) {
  const { data, error } = await supabase
    .from('subscribers') // ✅ Nom de votre table
    .select('*')
    .eq('confirmation_token', token) // ✅ 'confirmation_token'
    .single();

  if (error) throw error;
  return data;
}