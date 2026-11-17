import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import {
  mergeHomepageConfig,
  NavTargetType,
  HomepageSectionEntry,
} from '../data/defaultHomepageConfig';
import { renderCustomIcon } from './Header';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, setActiveStep, updateFabricDetails, shopSettings } = useTailor();
  const { navigate } = useRouter();
  const { user } = useAuth();

  const hpConfig = mergeHomepageConfig(shopSettings?.homepageCustomization);
  const { hero, divisions, processCoverage, pageTheme } = hpConfig;

  const handleNavigateTarget = (targetType: NavTargetType, customUrl?: string) => {
    switch (targetType) {
      case 'home':
        setActiveStep('home');
        navigate('/');
        break;
      case 'tailoring':
        updateFabricDetails({ fabricSource: 'customer_provided' });
        setActiveStep('catalog');
        navigate('/catalog');
        break;
      case 'fabrics':
        updateFabricDetails({ fabricSource: 'shop_fabric' });
        setActiveStep('fabric_catalog');
        navigate('/fabric-catalog');
        break;
      case 'clothes':
        navigate('/ready-made');
        break;
      case 'track':
        setActiveStep('track_orders');
        navigate('/track-orders');
        break;
      case 'account':
      case 'login':
        navigate(user ? '/account' : '/login');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'custom_url':
        if (customUrl) {
          if (customUrl.startsWith('http://') || customUrl.startsWith('https://')) {
            window.location.href = customUrl;
          } else {
            navigate(customUrl);
          }
        }
        break;
    }
  };

  const spacingClass =
    pageTheme.sectionSpacing === 'compact'
      ? 'space-y-4 sm:space-y-6 pb-8'
      : pageTheme.sectionSpacing === 'spacious'
      ? 'space-y-10 sm:space-y-14 pb-16'
      : 'space-y-6 sm:space-y-10 pb-12';

  const heroHeadingSizeClass =
    hero.headingSize === 'sm'
      ? 'text-lg sm:text-2xl lg:text-3xl'
      : hero.headingSize === 'md'
      ? 'text-xl sm:text-3xl lg:text-4xl'
      : hero.headingSize === 'xl'
      ? 'text-2xl sm:text-5xl lg:text-6xl'
      : 'text-xl sm:text-4xl lg:text-5xl';

  const heroBackgroundStyle: React.CSSProperties =
    hero.bgType === 'solid'
      ? { backgroundColor: hero.bgSolidColor, color: hero.textColor }
      : hero.bgType === 'image' && hero.bgImageUrl
      ? {
          backgroundImage: `linear-gradient(rgba(15,23,42,${
            (hero.bgOverlayOpacity ?? 75) / 100
          }), rgba(15,23,42,${(hero.bgOverlayOpacity ?? 75) / 100})), url(${hero.bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: hero.textColor,
        }
      : {
          backgroundImage: `linear-gradient(to right, ${hero.bgGradientFrom}, ${hero.bgGradientVia}, ${hero.bgGradientTo})`,
          color: hero.textColor,
        };

  const renderHeroSection = (key: string) => {
    const visibleButtons = hero.buttons.filter((b) => b.visible);
    const visibleInfoRows = hero.shopCard.infoRows.filter((r) => r.visible);
    const primaryBtn = visibleButtons[0];
    const secondaryBtns = visibleButtons.slice(1);

    const textColumn = (
      <div
        className={`${
          !hero.shopCard.visible || hero.layoutOrder === 'stacked'
            ? 'lg:col-span-12'
            : 'lg:col-span-7'
        } space-y-3.5 sm:space-y-5`}
      >
        {hero.showTopBadge && (
          <div
            style={{
              backgroundColor: hero.topBadgeBgColor,
              color: hero.topBadgeTextColor,
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCFBF8]/15 text-[#FCFBF8] text-[11px] sm:text-sm font-bold border border-[#C5CBD4]/35 backdrop-blur-xs"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="line-clamp-1">{t(hero.topBadgeEn, hero.topBadgeBn)}</span>
          </div>
        )}

        <h1
          style={{ color: hero.textColor }}
          className={`${heroHeadingSizeClass} font-extrabold tracking-tight leading-snug sm:leading-tight text-[#FCFBF8] font-serif-title`}
        >
          {t(hero.headingEn, hero.headingBn)}
        </h1>

        {hero.showSubtitle && (
          <p
            style={{ color: hero.textColor, opacity: 0.92 }}
            className="text-xs sm:text-base text-[#E8ECF2] leading-relaxed max-w-2xl font-medium"
          >
            {t(hero.subtitleEn, hero.subtitleBn)}
          </p>
        )}

        {visibleButtons.length > 0 && (
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            {primaryBtn && (
              <button
                key={primaryBtn.id}
                onClick={() => handleNavigateTarget(primaryBtn.targetType, primaryBtn.customUrl)}
                style={{
                  backgroundColor: primaryBtn.bgColor,
                  color: primaryBtn.textColor,
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FCFBF8] hover:opacity-95 text-[#0F172A] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[44px]"
              >
                {renderCustomIcon(primaryBtn.icon, 'w-4 h-4 shrink-0')}
                <span>{t(primaryBtn.labelEn, primaryBtn.labelBn)}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            )}

            {secondaryBtns.length > 0 && (
              <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
                {secondaryBtns.map((btn) => {
                  const isLoginTarget = btn.targetType === 'login' || btn.targetType === 'account';
                  const displayLabel =
                    isLoginTarget && user
                      ? t('My Account', 'আমার প্যানেল')
                      : t(btn.labelEn, btn.labelBn);
                  return (
                    <button
                      key={btn.id}
                      onClick={() => handleNavigateTarget(btn.targetType, btn.customUrl)}
                      style={{
                        backgroundColor: btn.bgColor,
                        color: btn.textColor,
                      }}
                      className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#FCFBF8]/15 hover:opacity-90 text-[#FCFBF8] border border-[#C5CBD4]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[44px]"
                    >
                      {renderCustomIcon(btn.icon, 'w-4 h-4 shrink-0')}
                      <span className="truncate">{displayLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );

    const shopCardColumn = hero.shopCard.visible ? (
      <div
        style={{
          backgroundColor: hero.shopCard.bgColor,
          color: hero.shopCard.textColor,
        }}
        className={`${
          hero.layoutOrder === 'stacked' ? 'lg:col-span-12' : 'lg:col-span-5'
        } bg-[#FCFBF8] text-[#0F172A] rounded-2xl p-4 sm:p-6 border border-[#C5CBD4] shadow-lg space-y-3.5 sm:space-y-4`}
      >
        <div className="flex items-center justify-between border-b border-[#DCE0E6] pb-3.5">
          <div className="flex items-center gap-3">
            {hero.shopCard.logoImageUrl ? (
              <img
                src={hero.shopCard.logoImageUrl}
                alt="Atelier Logo"
                className="w-11 h-11 rounded-xl object-cover border border-[#C5CBD4] shadow-xs shrink-0"
              />
            ) : (
              <div
                style={{ backgroundColor: hero.shopCard.iconBgColor }}
                className="w-11 h-11 rounded-xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs shrink-0"
              >
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2
                style={{ color: hero.shopCard.textColor }}
                className="text-lg font-extrabold text-[#0F172A]"
              >
                {hero.shopCard.customTitle || shopSettings?.shopName || 'Digital Dorji Atelier'}
              </h2>
            </div>
          </div>
          {hero.shopCard.showStatusBadge && (
            <span
              style={{
                backgroundColor: hero.shopCard.statusBadgeBgColor,
                color: hero.shopCard.statusBadgeTextColor,
              }}
              className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300"
            >
              {t(hero.shopCard.statusBadgeEn, hero.shopCard.statusBadgeBn)}
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {visibleInfoRows.length > 0 && (
            <>
              {/* First Row Full Width */}
              {visibleInfoRows[0] && (
                <div
                  style={{ backgroundColor: visibleInfoRows[0].bgColor }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6]"
                >
                  {renderCustomIcon(visibleInfoRows[0].icon, 'w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5')}
                  <div>
                    <p className="font-extrabold text-[#0F172A]">
                      {t(visibleInfoRows[0].titleEn, visibleInfoRows[0].titleBn)}
                    </p>
                    <p className="text-xs text-[#334155] font-medium mt-0.5">
                      {t(visibleInfoRows[0].subtitleEn, visibleInfoRows[0].subtitleBn)}
                    </p>
                  </div>
                </div>
              )}

              {/* Remaining Rows in 2-col Grid */}
              {visibleInfoRows.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {visibleInfoRows.slice(1).map((row) => (
                    <div
                      key={row.id}
                      style={{ backgroundColor: row.bgColor }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6]"
                    >
                      {renderCustomIcon(row.icon, 'w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5')}
                      <div>
                        <p className="text-xs font-extrabold text-[#0F172A]">
                          {t(row.titleEn, row.titleBn)}
                        </p>
                        <p className="text-xs text-[#334155] font-semibold mt-0.5">
                          {t(row.subtitleEn, row.subtitleBn)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {hero.shopCard.showGuaranteeBar && (
            <div
              style={{
                backgroundColor: hero.shopCard.guaranteeBgColor,
                color: hero.shopCard.guaranteeTextColor,
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                {t(hero.shopCard.guaranteeTextEn, hero.shopCard.guaranteeTextBn)}
              </span>
              <span className="text-[#2C3A52] font-extrabold">
                {hero.shopCard.guaranteeRightBadge}
              </span>
            </div>
          )}
        </div>
      </div>
    ) : null;

    return (
      <section
        key={key}
        style={heroBackgroundStyle}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1E2530] via-[#2C3A52] to-[#354662] text-[#FCFBF8] p-5 sm:p-10 lg:p-12 border border-[#9BA3B0] shadow-md"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E8ECF2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0F172A]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {hero.layoutOrder === 'card_left_text_right' ? (
            <>
              {shopCardColumn}
              {textColumn}
            </>
          ) : (
            <>
              {textColumn}
              {shopCardColumn}
            </>
          )}
        </div>
      </section>
    );
  };

  const renderDivisionsSection = (key: string) => {
    const visibleCards = divisions.cards.filter((c) => c.visible);
    const gridColsClass =
      divisions.columns === 1
        ? 'grid-cols-1'
        : divisions.columns === 2
        ? 'grid-cols-1 lg:grid-cols-2'
        : 'grid-cols-1 lg:grid-cols-3';

    return (
      <section key={key} className="space-y-5">
        {divisions.showSectionHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#DCE0E6] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52] block mb-1">
                {t(divisions.badgeEn, divisions.badgeBn)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-serif-title">
                {t(divisions.titleEn, divisions.titleBn)}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#334155]">
              {t(divisions.subtitleEn, divisions.subtitleBn)}
            </p>
          </div>
        )}

        <div className={`grid ${gridColsClass} gap-6`}>
          {visibleCards.map((card) => (
            <div
              key={card.id}
              style={{ backgroundColor: card.cardBgColor }}
              className="bg-[#FCFBF8] rounded-2xl border-2 border-[#C5CBD4] hover:border-[#2C3A52] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {card.imageUrl && (
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-[#DCE0E6]">
                    <img
                      src={card.imageUrl}
                      alt={t(card.titleEn, card.titleBn)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div
                    style={{ backgroundColor: card.iconBgColor }}
                    className="w-12 h-12 rounded-2xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs"
                  >
                    {renderCustomIcon(card.icon, 'w-6 h-6')}
                  </div>
                  <span
                    style={{
                      backgroundColor: card.badgeBgColor,
                      color: card.badgeTextColor,
                    }}
                    className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8ECF2] text-[#0F172A] border border-[#C5CBD4]"
                  >
                    {t(card.badgeEn, card.badgeBn)}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title">
                    {t(card.titleEn, card.titleBn)}
                  </h3>
                  <p className="text-sm text-[#334155] font-medium mt-1.5 leading-relaxed">
                    {t(card.descriptionEn, card.descriptionBn)}
                  </p>
                </div>

                {card.bullets.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-[#EFECE6] text-xs sm:text-sm font-semibold text-[#1E2530]">
                    {card.bullets.map((b) => (
                      <li key={b.id} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{t(b.textEn, b.textBn)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => handleNavigateTarget(card.targetType, card.customUrl)}
                style={{
                  backgroundColor: card.buttonBgColor,
                  color: card.buttonTextColor,
                }}
                className="mt-6 w-full py-3.5 px-4 rounded-xl bg-[#2C3A52] hover:opacity-95 text-[#FCFBF8] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {renderCustomIcon(card.icon, 'w-4 h-4')}
                <span>{t(card.buttonLabelEn, card.buttonLabelBn)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProcessCoverageSection = (key: string) => {
    const visibleSteps = processCoverage.steps.filter((s) => s.visible);
    const visibleZones = processCoverage.zones.filter((z) => z.visible);

    const processCol = processCoverage.showProcessCard ? (
      <div
        style={{ backgroundColor: processCoverage.processCardBgColor }}
        className={`${
          !processCoverage.showCoverageCard || processCoverage.layoutOrder === 'stacked'
            ? 'lg:col-span-12'
            : 'lg:col-span-7'
        } bg-[#FCFBF8] rounded-2xl border border-[#C5CBD4] p-6 shadow-xs space-y-5`}
      >
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52]">
            {t(processCoverage.processBadgeEn, processCoverage.processBadgeBn)}
          </span>
          <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title mt-0.5">
            {t(processCoverage.processTitleEn, processCoverage.processTitleBn)}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleSteps.map((step) => (
            <div
              key={step.id}
              style={{ backgroundColor: step.bgColor }}
              className="p-4 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8]">
                  {step.stepBadge}
                </span>
                {renderCustomIcon(step.icon, 'w-4 h-4 text-[#2C3A52]')}
              </div>
              <h4 className="font-extrabold text-[#0F172A] text-sm">
                {t(step.titleEn, step.titleBn)}
              </h4>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(step.descriptionEn, step.descriptionBn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const coverageCol = processCoverage.showCoverageCard ? (
      <div
        style={{ backgroundColor: processCoverage.coverageCardBgColor }}
        className={`${
          !processCoverage.showProcessCard || processCoverage.layoutOrder === 'stacked'
            ? 'lg:col-span-12'
            : 'lg:col-span-5'
        } bg-[#FCFBF8] rounded-2xl border border-[#C5CBD4] p-6 shadow-xs flex flex-col justify-between space-y-5`}
      >
        <div className="space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52]">
              {t(processCoverage.coverageBadgeEn, processCoverage.coverageBadgeBn)}
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title mt-0.5">
              {t(processCoverage.coverageTitleEn, processCoverage.coverageTitleBn)}
            </h3>
          </div>

          {visibleZones.map((zone) => (
            <div
              key={zone.id}
              style={{
                backgroundColor: zone.bgColor,
                color: zone.textColor,
                borderColor: zone.borderColor,
              }}
              className="p-4 rounded-xl bg-[#E8ECF2]/70 border border-[#C5CBD4] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold flex items-center gap-1.5">
                  {renderCustomIcon(zone.icon, 'w-4 h-4 shrink-0')}
                  {t(zone.titleEn, zone.titleBn)}
                </span>
                <span
                  style={{
                    backgroundColor: zone.badgeBgColor,
                    color: zone.badgeTextColor,
                  }}
                  className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#2C3A52] text-[#FCFBF8]"
                >
                  {zone.badgeText}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                {t(zone.descriptionEn, zone.descriptionBn)}
              </p>
            </div>
          ))}
        </div>

        {processCoverage.showBottomLinks && (
          <div className="pt-2 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => navigate('/about')}
              className="text-xs font-extrabold text-[#2C3A52] hover:underline cursor-pointer"
            >
              {t(processCoverage.aboutLinkEn, processCoverage.aboutLinkBn)}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-xs font-extrabold text-[#2C3A52] hover:underline cursor-pointer"
            >
              {t(processCoverage.contactLinkEn, processCoverage.contactLinkBn)}
            </button>
          </div>
        )}
      </div>
    ) : null;

    return (
      <section key={key} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {processCoverage.layoutOrder === 'coverage_left' ? (
          <>
            {coverageCol}
            {processCol}
          </>
        ) : (
          <>
            {processCol}
            {coverageCol}
          </>
        )}
      </section>
    );
  };

  const renderCustomBlockSection = (sec: HomepageSectionEntry) => {
    const block = sec.customBlock;
    if (!block) return null;

    const alignClass =
      block.textAlign === 'left'
        ? 'text-left items-start'
        : block.textAlign === 'right'
        ? 'text-right items-end'
        : 'text-center items-center';

    const imgHeightClass =
      block.imageHeight === 'sm'
        ? 'h-44'
        : block.imageHeight === 'lg'
        ? 'h-96'
        : 'h-64';

    if (block.variant === 'announcement_bar') {
      return (
        <section
          key={sec.id}
          style={{
            backgroundColor: block.bgColor,
            color: block.textColor,
            borderColor: block.borderColor,
          }}
          className="rounded-2xl border px-4 py-3 sm:px-6 sm:py-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {(block.badgeEn || block.badgeBn) && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 border border-white/30">
                {t(block.badgeEn || '', block.badgeBn || '')}
              </span>
            )}
            <p className="text-xs sm:text-sm font-extrabold">
              {t(block.headingEn, block.headingBn)}
            </p>
          </div>
          {(block.buttonLabelEn || block.buttonLabelBn) && (
            <button
              onClick={() =>
                handleNavigateTarget(block.buttonTargetType || 'tailoring', block.buttonCustomUrl)
              }
              style={{
                backgroundColor: block.buttonBgColor || '#FCFBF8',
                color: block.buttonTextColor || '#0F172A',
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
            >
              <span>{t(block.buttonLabelEn || '', block.buttonLabelBn || '')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </section>
      );
    }

    return (
      <section
        key={sec.id}
        style={{
          backgroundColor: block.bgColor,
          color: block.textColor,
          borderColor: block.borderColor,
        }}
        className="rounded-2xl border-2 p-5 sm:p-8 shadow-xs space-y-4 overflow-hidden"
      >
        {block.imageUrl && (
          <div className={`w-full ${imgHeightClass} rounded-xl overflow-hidden border border-black/10`}>
            <img
              src={block.imageUrl}
              alt={t(block.headingEn, block.headingBn)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className={`flex flex-col ${alignClass} space-y-2.5`}>
          {(block.badgeEn || block.badgeBn) && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/10">
              {t(block.badgeEn || '', block.badgeBn || '')}
            </span>
          )}
          <h2 className="text-xl sm:text-3xl font-extrabold font-serif-title">
            {t(block.headingEn, block.headingBn)}
          </h2>
          {(block.bodyEn || block.bodyBn) && (
            <p className="text-xs sm:text-sm font-medium max-w-3xl leading-relaxed opacity-90">
              {t(block.bodyEn || '', block.bodyBn || '')}
            </p>
          )}
          {(block.buttonLabelEn || block.buttonLabelBn) && (
            <div className="pt-2">
              <button
                onClick={() =>
                  handleNavigateTarget(block.buttonTargetType || 'tailoring', block.buttonCustomUrl)
                }
                style={{
                  backgroundColor: block.buttonBgColor || '#2C3A52',
                  color: block.buttonTextColor || '#FCFBF8',
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{t(block.buttonLabelEn || '', block.buttonLabelBn || '')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className={spacingClass}>
      {hpConfig.sections
        .filter((sec) => sec.visible)
        .map((sec) => {
          if (sec.type === 'hero') return renderHeroSection(sec.id);
          if (sec.type === 'divisions') return renderDivisionsSection(sec.id);
          if (sec.type === 'process_coverage') return renderProcessCoverageSection(sec.id);
          if (sec.type === 'custom_block') return renderCustomBlockSection(sec);
          return null;
        })}
    </div>
  );
};


