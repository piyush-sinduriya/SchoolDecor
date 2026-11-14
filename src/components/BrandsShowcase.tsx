import { ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { MATERIAL_BRANDS } from '../utils/campusLocations';
import { PAGE_EASE_OUT } from './PageMotion';
import type { PreviewRoute } from './HeaderNav';

interface BrandsShowcaseProps {
  onNavigate: (r: PreviewRoute) => void;
  compact?: boolean;
}

export function BrandsShowcase({ onNavigate, compact = false }: BrandsShowcaseProps) {
  return (
    <section
      data-testid="brands-showcase"
      className={`border-y border-[#E5DEC9] bg-gradient-to-b from-[#FAF7F0] via-[#FFFFFF] to-[#FAF7F0] ${
        compact ? 'py-12 md:py-14' : 'py-14 md:py-20'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.5, ease: PAGE_EASE_OUT }}
          className="flex flex-wrap items-end justify-between gap-4 mb-9"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-block w-6 h-[3px] rounded-full bg-[#007B36]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                Certified Material &amp; Manufacturing Partners
              </p>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#161A17] tracking-tight text-balance">
              Brands &amp; Engineering Standards Behind{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">Every Classroom</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-[#4D554E] leading-relaxed">
              From FSC European birchwood and BIFMA ergonomic frames to chemical-grade phenolic lab surfaces, inspect the specialized partner divisions supplying School Decor campuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#161A17] text-[#161A17] hover:text-white border border-[#E5DEC9] text-xs sm:text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
          {MATERIAL_BRANDS.map((brand, idx) => (
            <motion.button
              key={brand.id}
              type="button"
              data-testid={`brand-card-${brand.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: idx * 0.05, ease: PAGE_EASE_OUT }}
              onClick={() => onNavigate({ page: 'collection', handle: brand.collectionHandle })}
              className="group text-left rounded-xl sm:rounded-2xl bg-white border border-[#E5DEC9] hover:border-[#161A17] p-3 sm:p-6 transition-all duration-250 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between gap-3 sm:gap-4"
            >
              <div className="space-y-2.5 sm:space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-3">
                  <div
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-mono-num text-[10px] sm:text-xs font-extrabold tracking-tight border transition-transform duration-250 group-hover:scale-105 shrink-0"
                    style={{
                      backgroundColor: brand.surfaceTint,
                      color: brand.accentHex,
                      borderColor: `${brand.accentHex}38`,
                    }}
                  >
                    {brand.markCode}
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-mono-num font-semibold border truncate max-w-full"
                    style={{
                      backgroundColor: brand.surfaceTint,
                      color: brand.accentHex,
                      borderColor: `${brand.accentHex}30`,
                    }}
                  >
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{brand.standard}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-[13px] sm:text-lg font-extrabold text-[#161A17] group-hover:text-[#007B36] transition-colors leading-snug">
                    {brand.name}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-[#4D554E] mt-1 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{brand.specialty}</p>
                </div>
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-[#EFEAD9] flex items-center justify-between gap-1 text-[10.5px] sm:text-xs font-bold">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[#4D554E]">
                  <Award className="w-3.5 h-3.5" style={{ color: brand.accentHex }} />
                  <span>Certified School Spec</span>
                </span>
                <span
                  className="inline-flex items-center justify-between sm:justify-start w-full sm:w-auto gap-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: brand.accentHex }}
                >
                  <span>View Collection</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continuous Brand Certification Ribbon */}
        <div
          aria-hidden="true"
          className="mt-8 rounded-2xl bg-[#FAF7F0] border border-[#E5DEC9] py-3 overflow-hidden sd-marquee-group"
        >
          <div className="sd-marquee-track-left flex items-center gap-8 text-xs font-mono-num font-bold uppercase tracking-widest text-[#4D554E]">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8 shrink-0">
                {MATERIAL_BRANDS.map((brand) => (
                  <span key={`${dup}-${brand.id}`} className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: brand.accentHex }}
                    />
                    <span className="text-[#161A17]">{brand.name}</span>
                    <span className="text-[#4D554E]/75">· {brand.standard}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
