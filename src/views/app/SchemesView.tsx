import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { verifiedSchemes } from '../../data/schemesData';
import { GovernmentScheme, SchemeCategory } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldCheck,
  Landmark,
  ArrowRight,
  Filter,
  Sparkles,
  Building2,
} from 'lucide-react';

interface SchemesViewProps {
  onNavigate: (path: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { bookmarkedSchemeIds, toggleBookmark } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return verifiedSchemes.filter((sch) => {
      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedSchemeIds.includes(sch.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && sch.category !== selectedCategory && sch.category !== 'all') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sch.name.toLowerCase().includes(q) || sch.nameMr.includes(q);
        const matchesAgency = sch.agency.toLowerCase().includes(q);
        const matchesDesc =
          sch.shortDescription.toLowerCase().includes(q) ||
          sch.shortDescriptionMr.includes(q);
        const matchesBeneficiary =
          sch.targetBeneficiaries.toLowerCase().includes(q) ||
          sch.targetBeneficiariesMr.includes(q);

        if (!matchesName && !matchesAgency && !matchesDesc && !matchesBeneficiary) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, showBookmarksOnly, bookmarkedSchemeIds]);

  // Recommended match based on profile category and district
  const getMatchScore = (scheme: GovernmentScheme) => {
    if (!profile) return null;
    let reasons: string[] = [];

    if (profile.category === 'kirana_retail' && (scheme.category === 'retail' || scheme.category === 'all')) {
      reasons.push('Relevant for retail & shopkeeping enterprises');
    }
    if (profile.category === 'agriculture' && scheme.category === 'agriculture') {
      reasons.push('Matches agricultural and allied activities');
    }
    if (scheme.id.includes('maharashtra') || scheme.id === 'annasaheb-patil-scheme') {
      reasons.push(`Covers ${profile.district || 'Maharashtra'} state beneficiaries`);
    }

    return reasons.length > 0 ? reasons : null;
  };

  const categories: { value: SchemeCategory; labelEn: string; labelMr: string }[] = [
    { value: 'all', labelEn: 'All Categories', labelMr: 'सर्व योजना' },
    { value: 'retail', labelEn: 'Retail & Shops', labelMr: 'किरकोळ व दुकाने' },
    { value: 'manufacturing', labelEn: 'Manufacturing & Small Units', labelMr: 'उत्पादन व उद्योग' },
    { value: 'agriculture', labelEn: 'Agri & Post-Harvest', labelMr: 'शेती व कृषी प्रक्रिया' },
    { value: 'women', labelEn: 'Women Entrepreneurs', labelMr: 'महिला उद्योजिका' },
    { value: 'services', labelEn: 'Services & Self-Employment', labelMr: 'सेवा व स्वयंरोजगार' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('schemesTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('schemesSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showBookmarksOnly ? 'saffron' : 'outline'}
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>
              {showBookmarksOnly
                ? 'Showing Saved Only'
                : `Saved Schemes (${bookmarkedSchemeIds.length})`}
            </span>
          </Button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('schemesSearchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
        </div>

        {/* Categories row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === c.value
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'mr' ? c.labelMr : c.labelEn}
            </button>
          ))}
        </div>
      </Card>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.length === 0 ? (
          <div className="col-span-2 py-14 text-center text-slate-400 text-xs">
            No government schemes match your criteria.
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const isSaved = bookmarkedSchemeIds.includes(scheme.id);
            const matchReasons = getMatchScore(scheme);

            return (
              <Card
                key={scheme.id}
                className="p-5 border-slate-200 flex flex-col justify-between space-y-4 hover:border-emerald-600/60 transition-all duration-200 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Agency & Bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
                      {scheme.agency}
                    </span>
                    <button
                      onClick={() => toggleBookmark(scheme.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {language === 'mr' ? scheme.nameMr : scheme.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'mr' ? scheme.shortDescriptionMr : scheme.shortDescription}
                  </p>

                  {/* Funding & Subsidy Pill Highlights */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Maximum Limit:</span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {scheme.maxFunding}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-800">
                      <span>Subsidy / Concession:</span>
                      <span className="font-semibold text-right">{scheme.subsidyRate}</span>
                    </div>
                  </div>

                  {/* Profile match indicator if applicable */}
                  {matchReasons && (
                    <div className="p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-[11px] text-emerald-900 space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Why this matches your business:</span>
                      </div>
                      <p className="text-emerald-800">{matchReasons.join(' · ')}</p>
                    </div>
                  )}
                </div>

                {/* Footer with verification date and View Details Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified: {scheme.lastVerifiedDate}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate(`/schemes/${scheme.id}`)}
                    className="group-hover:border-emerald-700 group-hover:text-emerald-900"
                  >
                    <span>{t('schemesViewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
