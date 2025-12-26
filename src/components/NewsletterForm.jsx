// src/components/NewsletterForm.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function NewsletterForm({ t = {}, currentLang = 'en' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  
  const newsletter = t.newsletter ?? {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // 1. Validation côté client
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage(currentLang === 'fr' ? 'Email invalide' : 'Invalid email');
      return;
    }

    // 2. Vérification Honeypot (sécurité anti-bot)
    const formData = new FormData(e.target);
    if (formData.get('website')) {
      // Si le champ caché est rempli, on simule un succès sans rien envoyer
      setStatus('success');
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: currentLang }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Error');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Server error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl animate-fade-in">
        <div className="text-4xl mb-4">📩</div>
        <h3 className="text-xl font-poppins font-bold text-white mb-2">
          {currentLang === 'fr' ? 'Presque fini !' : 'Almost there!'}
        </h3>
        <p className="text-green-50">
          {currentLang === 'fr' 
            ? 'Veuillez cliquer sur le lien envoyé à votre adresse pour confirmer.' 
            : 'Please click the link sent to your email to confirm your subscription.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl transition-shadow focus-within:shadow-2xl">
          <div className="relative flex-grow">
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              placeholder={newsletter.placeholder || 'your@email.com'}
              required
              className="w-full px-5 py-4 text-slate-900 bg-transparent border-none focus:ring-0 font-inter outline-none"
            />
          </div>

          {/* Champ Honeypot (Invisible pour les humains) */}
          <input type="text" name="website" className="hidden" tabIndex="-1" autoComplete="off" />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#ff6b35] hover:bg-[#e65a2b] text-white font-poppins font-bold rounded-xl px-8 py-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 whitespace-nowrap min-w-[160px]"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              newsletter.button || 'Subscribe'
            )}
          </button>
        </div>

        {/* Message d'erreur dynamique */}
        {status === 'error' && (
          <div className="absolute -bottom-10 left-0 right-0 text-red-200 text-sm font-medium animate-fade-in text-center">
            ⚠️ {errorMessage}
          </div>
        )}
      </form>

      {/* Avantages sous le formulaire */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-green-100/80 font-inter">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293l-8 8-4-4-1.414 1.414 5.414 5.414 9.414-9.414-1.414-1.414z"/></svg>
          {newsletter.daily || 'Daily deals'}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293l-8 8-4-4-1.414 1.414 5.414 5.414 9.414-9.414-1.414-1.414z"/></svg>
          {newsletter.exclusive || 'Secret codes'}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293l-8 8-4-4-1.414 1.414 5.414 5.414 9.414-9.414-1.414-1.414z"/></svg>
          {newsletter.unsubscribe || '1-click unsubscribe'}
        </span>
      </div>
    </div>
  );
}