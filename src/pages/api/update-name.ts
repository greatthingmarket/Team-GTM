// src/pages/api/update-name.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, firstName } = await request.json();

    if (!token || !firstName) {
      return new Response(
        JSON.stringify({ error: 'Missing token or firstName' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mettre à jour le prénom dans Supabase
    const { data, error } = await supabase
      .from('subscribers')
      .update({ first_name: firstName.trim() })
      .eq('confirmation_token', token)
      .select()
      .single();

    if (error) {
      console.error('Update name error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update name' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update name API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};