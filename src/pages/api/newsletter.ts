// src/pages/api/newsletter.ts
import type { APIRoute } from 'astro';
import { ratelimit } from '../../lib/ratelimit';
import { insertSubscriber, emailExists } from '../../lib/supabase';
import { sendConfirmationEmail } from '../../lib/resend';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Extraction et validation des données
    const body = await request.json();
    const { email, lang, website } = body;

    // Sécurité : Honeypot anti-bot
    if (website) {
      return new Response(JSON.stringify({ message: "Bot detected" }), { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    // 2. Rate Limiting (Upstash)
    const identifier = clientAddress || "anonymous";
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    if (!success) {
      return new Response(JSON.stringify({ 
        error: lang === 'fr' ? "Trop de requêtes. Réessayez plus tard." : "Too many requests. Please try later." 
      }), { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      });
    }

    // 3. Vérifier si l'abonné existe déjà dans Supabase
    const alreadyExists = await emailExists(email);
    if (alreadyExists) {
      return new Response(JSON.stringify({ 
        error: lang === 'fr' ? "Cet email est déjà inscrit." : "This email is already subscribed." 
      }), { status: 400 });
    }

    // 4. Génération d'un token de confirmation unique
    const token = crypto.randomUUID();

    // 5. Insertion dans Supabase (Statut non-confirmé par défaut)
    await insertSubscriber({
      email: email.toLowerCase(),
      language: lang || 'en',
      confirmation_token: token,
      confirmed: false,
      source: 'footer_newsletter'
    });

    // 6. Envoi de l'email de confirmation via Resend
    await sendConfirmationEmail({
      email: email.toLowerCase(),
      lang: lang || 'en',
      token: token
    });

    // 7. Réponse de succès
    return new Response(JSON.stringify({ 
      message: "Vérifiez votre boîte mail pour confirmer l'inscription !" 
    }), { status: 200 });

  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: "Server error",
      details: error.message 
    }), { status: 500 });
  }
};