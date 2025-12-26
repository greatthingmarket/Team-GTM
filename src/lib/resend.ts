// src/lib/resend.ts
import { Resend } from 'resend';
import { getEmailTemplate, emailTranslations } from '../i18n/emails.js';

const resendApiKey = import.meta.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(resendApiKey);

interface SendConfirmationEmailParams {
  email: string;
  firstName?: string;
  lang: string;
  token: string;
}

export async function sendConfirmationEmail({
  email,
  firstName,
  lang,
  token,
}: SendConfirmationEmailParams) {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://greatthingmarket.com';
  const confirmUrl = `${siteUrl}/${lang}/confirm?token=${token}`;
  
  // Typage correct avec assertion de type
  const translations = (emailTranslations as Record<string, any>)[lang] || emailTranslations.en;
  const htmlContent = getEmailTemplate(lang, firstName || '', confirmUrl);

  // ✅ Configuration finale : Newsletter sans réponse
  const isVerified = import.meta.env.RESEND_DOMAIN_VERIFIED === 'true';
  
  const fromAddress = isVerified
    ? 'Great Thing Market <newsletter@greatthingmarket.com>'
    : 'Great Thing Market <onboarding@resend.dev>';

  console.log('📧 Attempting to send email with Resend...', {
    to: email,
    from: fromAddress,
    domainVerified: isVerified,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: translations.subject,
      html: htmlContent,
      // Tags pour le tracking
      tags: [
        { name: 'category', value: 'newsletter_confirmation' },
        { name: 'language', value: lang },
      ],
    });

    if (error) {
      console.error('❌ Resend API error:', {
        message: error.message,
        name: error.name,
        statusCode: (error as any).statusCode,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('✅ Email sent successfully via Resend:', {
      emailId: data?.id,
      to: email,
    });

    return data;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
      lang,
    });
    throw error;
  }
}