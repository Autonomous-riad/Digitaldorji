import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { mergeHomepageConfig } from '../data/defaultHomepageConfig';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Mail, 
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, shopSettings } = useTailor();
  const { navigate } = useRouter();

  const hpConfig = mergeHomepageConfig(shopSettings?.homepageCustomization);
  const fCfg = hpConfig.footer;

  if (!fCfg.visible) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: fCfg.bgColor,
        color: fCfg.textColor,
        borderColor: fCfg.borderColor,
      }}
      className="bg-[#EFECE6] border-t border-[#DCE0E6] mt-auto pt-10 pb-8 text-[#1E2530] font-sans shadow-2xs"
    >
      <div className={`${hpConfig.pageTheme.containerWidth || 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div
          style={{ color: fCfg.textColor }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-[#434C5E]"
        >
          {/* Col 1: Business Identity & Overview */}
          <div className="space-y-3 lg:col-span-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              {fCfg.logoImageUrl ? (
                <img
                  src={fCfg.logoImageUrl}
                  alt={fCfg.brandTitle}
                  className="w-10 h-10 rounded-xl object-cover border border-[#9BA3B0] shadow-xs"
                />
              ) : (
                <div
                  style={{ backgroundColor: fCfg.logoBgColor }}
                  className="w-10 h-10 rounded-xl bg-[#2C3A52] text-[#FCFBF8] border border-[#9BA3B0] flex items-center justify-center shadow-xs group-hover:bg-[#1F2A3D] transition-all"
                >
                  <Scissors className="w-5 h-5 text-[#E8ECF2]" />
                </div>
              )}
              <div>
                <span
                  style={{ color: fCfg.textColor }}
                  className="text-xl font-extrabold tracking-tight text-[#1E2530] font-serif-title"
                >
                  {fCfg.brandTitle || 'Digital Dorji BD'}
                </span>
                <span className="block text-[11px] opacity-75 font-medium">
                  {t(fCfg.brandSubtitleEn, fCfg.brandSubtitleBn)}
                </span>
              </div>
            </button>

            <p className="text-xs leading-relaxed max-w-md opacity-90">
              {t(fCfg.descriptionEn, fCfg.descriptionBn)}
            </p>
          </div>

          {/* Col 2: Legal & Consumer Rights */}
          {fCfg.showLegalCol && (
            <div className="space-y-3">
              <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
                {t(fCfg.legalTitleEn, fCfg.legalTitleBn)}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => navigate('/privacy-policy')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/terms')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Terms of Service', 'সেবার শর্তাবলী')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/refund-policy')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Refund & Alteration Policy', 'রিফান্ড ও অলটারেশন')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/shipping-policy')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Shipping & Pickup Policy', 'শিপিং ও পিকআপ নীতি')}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Col 3: Company & Information */}
          {fCfg.showCompanyCol && (
            <div className="space-y-3">
              <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
                {t(fCfg.companyTitleEn, fCfg.companyTitleBn)}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => navigate('/about')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('About Digital Dorji', 'আমাদের সম্পর্কে')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Contact & Support', 'যোগাযোগ ও সাপোর্ট')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/track-orders')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Track Live Order', 'লাইভ অর্ডার ট্র্যাকিং')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/account')}
                    className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                  >
                    {t('Customer Account', 'গ্রাহক অ্যাকাউন্ট')}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Col 4: Real Business Address & Hotline */}
          {fCfg.showHotlineCol && (
            <div className="space-y-3">
              <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
                {t(fCfg.hotlineTitleEn, fCfg.hotlineTitleBn)}
              </h4>
              <div className="space-y-2 text-xs text-purple-950/80">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-800 shrink-0 mt-0.5" />
                  <span>{t(fCfg.addressEn, fCfg.addressBn)}</span>
                </p>
                <p className="flex items-center gap-2 font-bold text-purple-950 font-mono">
                  <Phone className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                  <span>{fCfg.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                  <a href={`mailto:${fCfg.email}`} className="text-purple-900 hover:underline">
                    {fCfg.email}
                  </a>
                </p>
                <p className="flex items-center gap-2 text-[11px] text-purple-950/70">
                  <Clock className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                  <span>{t(fCfg.hoursEn, fCfg.hoursBn)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Copyright */}
        <div
          style={{ borderColor: fCfg.borderColor }}
          className="pt-8 mt-8 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-75"
        >
          <p>
            © {new Date().getFullYear()} {fCfg.brandTitle || 'Digital Dorji BD'}.{' '}
            {t(fCfg.copyrightEn, fCfg.copyrightBn)}
          </p>
        </div>
      </div>
    </footer>
  );
};

