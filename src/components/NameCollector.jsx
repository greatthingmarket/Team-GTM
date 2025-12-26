// src/components/NameCollector.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function NameCollector({ token, currentLang = 'en', subscriberEmail }) {
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | skipped

  // Traductions
  const translations = {
    en: {
      title: "One more thing! 🎉",
      subtitle: "Help us personalize your experience",
      placeholder: "Your first name (optional)",
      submit: "Save",
      skip: "Skip for now",
      success: "Perfect! You're all set 🎊",
      cta: "Explore Today's Deals",
    },
    fr: {
      title: "Une dernière chose ! 🎉",
      subtitle: "Aidez-nous à personnaliser votre expérience",
      placeholder: "Votre prénom (optionnel)",
      submit: "Enregistrer",
      skip: "Passer",
      success: "Parfait ! Tout est prêt 🎊",
      cta: "Découvrir les Offres du Jour",
    },
    es: {
      title: "¡Una cosa más! 🎉",
      subtitle: "Ayúdanos a personalizar tu experiencia",
      placeholder: "Tu nombre (opcional)",
      submit: "Guardar",
      skip: "Omitir",
      success: "¡Perfecto! Todo listo 🎊",
      cta: "Explorar Ofertas del Día",
    },
    de: {
      title: "Noch eine Sache! 🎉",
      subtitle: "Helfen Sie uns, Ihr Erlebnis zu personalisieren",
      placeholder: "Ihr Vorname (optional)",
      submit: "Speichern",
      skip: "Überspringen",
      success: "Perfekt! Alles bereit 🎊",
      cta: "Heutige Angebote Entdecken",
    },
    ar: {
      title: "شيء آخر! 🎉",
      subtitle: "ساعدنا في تخصيص تجربتك",
      placeholder: "اسمك الأول (اختياري)",
      submit: "حفظ",
      skip: "تخطي",
      success: "مثالي! كل شيء جاهز 🎊",
      cta: "استكشف عروض اليوم",
    },
    pt: {
      title: "Mais uma coisa! 🎉",
      subtitle: "Ajude-nos a personalizar sua experiência",
      placeholder: "Seu primeiro nome (opcional)",
      submit: "Salvar",
      skip: "Pular",
      success: "Perfeito! Tudo pronto 🎊",
      cta: "Explorar Ofertas do Dia",
    },
  };

  const t = translations[currentLang] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      handleSkip();
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, firstName: firstName.trim() }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        // Si erreur, on affiche quand même le succès (non-bloquant)
        setStatus('success');
      }
    } catch (error) {
      console.error('Name update error:', error);
      setStatus('success'); // Non-bloquant
    }
  };

  const handleSkip = () => {
    setStatus('skipped');
  };

  if (status === 'success' || status === 'skipped') {
    return (
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 text-center animate-fade-in">
        <div class="text-4xl mb-3">🎊</div>
        <h3 class="text-xl font-bold text-primary mb-4">{t.success}</h3>
        <a
          href={`/${currentLang}/#deals-of-day`}
          class="inline-block bg-secondary hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition transform hover:scale-105"
        >
          {t.cta}
        </a>
      </div>
    );
  }

  return (
    <div class="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200 animate-fade-in">
      <h3 class="text-lg font-bold text-primary mb-1">{t.title}</h3>
      <p class="text-sm text-gray-600 mb-4">{t.subtitle}</p>

      <form onSubmit={handleSubmit} class="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={firstName}
          onInput={(e) => setFirstName(e.target.value)}
          placeholder={t.placeholder}
          disabled={status === 'loading'}
          class="flex-1 px-4 py-2 rounded-full border-2 border-orange-300 focus:outline-none focus:border-orange-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? '⏳' : t.submit}
        </button>
      </form>

      <button
        onClick={handleSkip}
        class="text-sm text-gray-500 hover:text-gray-700 underline mt-3 transition"
      >
        {t.skip}
      </button>
    </div>
  );
}