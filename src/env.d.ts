/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Private keys (serveur uniquement)
  readonly RESEND_API_KEY: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_KEY: string;
  readonly UPSTASH_REDIS_REST_URL: string;
  readonly UPSTASH_REDIS_REST_TOKEN: string;
  readonly INDEXNOW_KEY?: string;
  
  // Public keys (disponibles côté client)
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION: string;
  readonly PUBLIC_BING_VERIFICATION?: string;
  readonly PUBLIC_CLARITY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}