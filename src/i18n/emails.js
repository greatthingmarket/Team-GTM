// src/i18n/emails.js
export const emailTranslations = {
  en: {
    subject: "🎁 Confirm your subscription to Great Thing Market!",
    greeting: "Hello",
    intro: "Thank you for subscribing to Great Thing Market! You're one step away from receiving exclusive deals up to 80% off.",
    ctaButton: "Confirm My Subscription",
    benefits: "What you'll receive:",
    benefit1: "✅ Daily deals selected by our experts",
    benefit2: "✅ Secret promo codes reserved for subscribers",
    benefit3: "✅ Early access to flash sales",
    footer: "If you didn't subscribe, simply ignore this email.",
    disclaimer: "This link is valid for 48 hours.",
  },
  fr: {
    subject: "🎁 Confirmez votre abonnement à Great Thing Market !",
    greeting: "Bonjour",
    intro: "Merci de vous être inscrit à Great Thing Market ! Vous êtes à un pas de recevoir des offres exclusives jusqu'à 80% de réduction.",
    ctaButton: "Confirmer Mon Abonnement",
    benefits: "Ce que vous recevrez :",
    benefit1: "✅ Des offres quotidiennes sélectionnées par nos experts",
    benefit2: "✅ Des codes promo secrets réservés aux abonnés",
    benefit3: "✅ Un accès anticipé aux ventes flash",
    footer: "Si vous ne vous êtes pas inscrit, ignorez simplement cet email.",
    disclaimer: "Ce lien est valide pendant 48 heures.",
  },
  es: {
    subject: "🎁 ¡Confirma tu suscripción a Great Thing Market!",
    greeting: "Hola",
    intro: "¡Gracias por suscribirte a Great Thing Market! Estás a un paso de recibir ofertas exclusivas con hasta 80% de descuento.",
    ctaButton: "Confirmar Mi Suscripción",
    benefits: "Lo que recibirás:",
    benefit1: "✅ Ofertas diarias seleccionadas por nuestros expertos",
    benefit2: "✅ Códigos promocionales secretos reservados para suscriptores",
    benefit3: "✅ Acceso anticipado a ventas flash",
    footer: "Si no te suscribiste, simplemente ignora este correo.",
    disclaimer: "Este enlace es válido por 48 horas.",
  },
  de: {
    subject: "🎁 Bestätigen Sie Ihr Abonnement bei Great Thing Market!",
    greeting: "Hallo",
    intro: "Vielen Dank für Ihr Abonnement bei Great Thing Market! Sie sind nur einen Schritt davon entfernt, exklusive Angebote mit bis zu 80% Rabatt zu erhalten.",
    ctaButton: "Mein Abonnement Bestätigen",
    benefits: "Was Sie erhalten werden:",
    benefit1: "✅ Tägliche Angebote, ausgewählt von unseren Experten",
    benefit2: "✅ Geheime Promo-Codes nur für Abonnenten",
    benefit3: "✅ Frühzeitiger Zugang zu Flash-Sales",
    footer: "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach.",
    disclaimer: "Dieser Link ist 48 Stunden gültig.",
  },
  ar: {
    subject: "🎁 أكد اشتراكك في Great Thing Market!",
    greeting: "مرحبا",
    intro: "شكرًا لاشتراكك في Great Thing Market! أنت على بعد خطوة واحدة من تلقي عروض حصرية تصل إلى 80٪ خصم.",
    ctaButton: "تأكيد اشتراكي",
    benefits: "ما ستحصل عليه:",
    benefit1: "✅ عروض يومية مختارة من قبل خبرائنا",
    benefit2: "✅ رموز ترويجية سرية محجوزة للمشتركين",
    benefit3: "✅ وصول مبكر إلى مبيعات الفلاش",
    footer: "إذا لم تشترك، تجاهل هذا البريد الإلكتروني ببساطة.",
    disclaimer: "هذا الرابط صالح لمدة 48 ساعة.",
  },
  pt: {
    subject: "🎁 Confirme sua assinatura no Great Thing Market!",
    greeting: "Olá",
    intro: "Obrigado por se inscrever no Great Thing Market! Você está a um passo de receber ofertas exclusivas com até 80% de desconto.",
    ctaButton: "Confirmar Minha Assinatura",
    benefits: "O que você receberá:",
    benefit1: "✅ Ofertas diárias selecionadas por nossos especialistas",
    benefit2: "✅ Códigos promocionais secretos reservados para assinantes",
    benefit3: "✅ Acesso antecipado a vendas relâmpago",
    footer: "Se você não se inscreveu, simplesmente ignore este e-mail.",
    disclaimer: "Este link é válido por 48 horas.",
  },
};

// Fonction helper pour générer le HTML de l'email
export function getEmailTemplate(lang, firstName, confirmUrl) {
  const t = emailTranslations[lang] || emailTranslations.en;
  
  // ✅ CORRECTION : Utiliser greeting au lieu de name
  const greeting = firstName && firstName.trim() 
    ? `${t.greeting} ${firstName}` 
    : t.greeting;

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f8fffe;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a936f 0%, #22c55e 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      font-family: 'Poppins', sans-serif;
    }
    .content {
      padding: 40px 30px;
      color: #1a1a1a;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #1a936f;
      margin-bottom: 20px;
    }
    .intro {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
      color: #333333;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #ff6b35 0%, #e65a2b 100%);
      color: #ffffff;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .benefits {
      background-color: #f0fdfa;
      border-left: 4px solid #22c55e;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
    }
    .benefits h3 {
      color: #1a936f;
      margin-top: 0;
      font-size: 18px;
    }
    .benefits ul {
      list-style: none;
      padding: 0;
      margin: 15px 0 0 0;
    }
    .benefits li {
      padding: 8px 0;
      font-size: 14px;
      color: #333333;
    }
    .footer {
      padding: 20px 30px;
      background-color: #f9fafb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .disclaimer {
      margin-top: 15px;
      font-style: italic;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Great Thing Market</div>
    </div>
    
    <div class="content">
      <div class="greeting">${greeting} 👋</div>
      <p class="intro">${t.intro}</p>
      
      <div style="text-align: center;">
        <a href="${confirmUrl}" class="cta-button">${t.ctaButton}</a>
      </div>
      
      <div class="benefits">
        <h3>${t.benefits}</h3>
        <ul>
          <li>${t.benefit1}</li>
          <li>${t.benefit2}</li>
          <li>${t.benefit3}</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        ${t.footer}
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Great Thing Market</p>
      <p class="disclaimer">${t.disclaimer}</p>
      <p style="font-size: 11px; color: #9ca3af; margin-top: 15px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
        📧 This is an automated newsletter. Please do not reply to this email.<br>
        For support, contact us at <a href="mailto:contact@greatthingmarket.com" style="color: #1a936f; text-decoration: none;">contact@greatthingmarket.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}