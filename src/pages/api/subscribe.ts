// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { insertSubscriber, emailExists } from '../../lib/supabase';
import { sendConfirmationEmail } from '../../lib/resend';
import { randomBytes } from 'crypto';

export const prerender = false;

// Validation email stricte
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Rate limiting simple (en mémoire, pour production utilisez Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 heure
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    console.log('📧 Newsletter subscription attempt started');

    // ✅ VÉRIFICATION 1 : Variables d'environnement
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'RESEND_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          details: `Missing: ${missingVars.join(', ')}` 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const firstName = formData.get('first_name')?.toString().trim();
    const lastName = formData.get('last_name')?.toString().trim();
    const source = formData.get('source')?.toString() || 'homepage';
    const lang = formData.get('lang')?.toString() || 'en';
    const honeypot = formData.get('website')?.toString();

    console.log('📝 Form data received:', { 
      email, 
      firstName, 
      source, 
      lang,
      hasHoneypot: !!honeypot 
    });

    // 🛡️ SÉCURITÉ 1 : Honeypot
    if (honeypot) {
      console.warn('⚠️ Spam detected via honeypot:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🛡️ SÉCURITÉ 2 : Validation email
    if (!email || !EMAIL_REGEX.test(email)) {
      console.warn('⚠️ Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🛡️ SÉCURITÉ 3 : Rate limiting
    const ip = clientAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      console.warn('⚠️ Rate limit exceeded for IP:', ip);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ VÉRIFICATION 2 : Email existant
    console.log('🔍 Checking if email exists...');
    const exists = await emailExists(email);
    if (exists) {
      console.warn('⚠️ Email already subscribed:', email);
      return new Response(
        JSON.stringify({ error: 'Email already subscribed' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ VÉRIFICATION 3 : Génération du token
    console.log('🔑 Generating confirmation token...');
    const token = randomBytes(32).toString('hex');

    // ✅ VÉRIFICATION 4 : Insertion dans Supabase
    console.log('💾 Inserting subscriber into database...');
    try {
      await insertSubscriber({
        email,
        first_name: firstName,
        last_name: lastName,
        source,
        language: lang,
        confirmation_token: token,
      });
      console.log('✅ Subscriber inserted successfully');
    } catch (dbError) {
      console.error('❌ Database insertion failed:', dbError);
      
      // Erreur spécifique pour email unique
      if (dbError instanceof Error && dbError.message.includes('unique')) {
        return new Response(
          JSON.stringify({ error: 'Email already subscribed' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      throw dbError; // Propager l'erreur pour le catch global
    }

    // ✅ VÉRIFICATION 5 : Envoi de l'email
    console.log('📧 Sending confirmation email...');
    try {
      await sendConfirmationEmail({
        email,
        firstName,
        lang,
        token,
      });
      console.log('✅ Confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // L'utilisateur est déjà en base, on ne renvoie pas d'erreur
      console.warn('⚠️ Subscriber saved but email failed. Token:', token);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Subscription registered, but email delivery delayed',
          warning: 'Please check your spam folder or contact support if you don\'t receive the email'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🎉 Newsletter subscription completed successfully');
    return new Response(
      JSON.stringify({ success: true, message: 'Confirmation email sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // ✅ AMÉLIORATION : Logs détaillés de l'erreur
    console.error('❌ Subscribe API CRITICAL ERROR:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name,
    });

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        hint: 'Please check server logs for details'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};