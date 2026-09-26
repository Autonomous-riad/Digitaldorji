import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const { t } = useTailor();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Interactive Floating Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white text-purple-950 text-xs font-semibold rounded-2xl shadow-lg border border-purple-100 animate-bounce">
          <span>{t('Need tailoring advice? Chat now!', 'দর্জি পরামর্শ প্রয়োজন? চ্যাট করুন')}</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-purple-950/40 hover:text-purple-950 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href="https://wa.me/8801711002233?text=Hello%20Digital%20Dorji%2C%20I%20have%20a%20question%20about%20bespoke%20tailoring."
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-button"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white focus:outline-none"
        aria-label="WhatsApp Helpline"
        title="WhatsApp Support: +880 1711-002233"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </a>
    </div>
  );
};
