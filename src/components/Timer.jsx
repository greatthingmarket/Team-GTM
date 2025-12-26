import { useEffect, useState } from 'preact/hooks';

/**
 * @param {Object} props
 * @param {string} props.expiresAt - Date d'expiration au format ISO (ex: "2025-08-06T23:59:00")
 */
export default function Timer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown(); // Initial
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{timeLeft}</span>;
}
