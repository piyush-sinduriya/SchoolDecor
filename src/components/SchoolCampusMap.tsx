import { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMapCanvas,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { Clock, Compass, MapPin, RotateCcw, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import {
  REGIONAL_CAMPUS_HUBS,
  filterCampusHubs,
  type CampusHub,
  type HubCategory,
} from '../utils/campusLocations';
import { PAGE_EASE_OUT } from './PageMotion';

interface SchoolCampusMapProps {
  onOpenQuote?: (title?: string) => void;
  compact?: boolean;
}

const INDIA_CENTER = { lat: 21.1458, lng: 79.0882 };
const INDIA_DEFAULT_ZOOM = 4.6;

function resolveMapsApiKey(): string {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return (viteEnv?.VITE_GOOGLE_MAPS_API_KEY || '').trim();
}

function getPinStyle(category: CampusHub['category'], selected: boolean) {
  if (selected) {
    return { background: '#C22768', borderColor: '#8B1445', glyphColor: '#FFFFFF', scale: 1.28 };
  }
  switch (category) {
    case 'stem':
      return { background: '#161A17', borderColor: '#000000', glyphColor: '#F8D000', scale: 1.08 };
    case 'dispatch':
      return { background: '#D91B22', borderColor: '#981116', glyphColor: '#FFFFFF', scale: 1.08 };
    default:
      return { background: '#007B36', borderColor: '#004F22', glyphColor: '#FFFFFF', scale: 1.1 };
  }
}

function MapCameraController({
  selectedHub,
  resetSignal,
}: {
  selectedHub: CampusHub | null;
  resetSignal: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedHub) {
      map.panTo({ lat: selectedHub.lat, lng: selectedHub.lng });
      const currentZoom = map.getZoom() ?? INDIA_DEFAULT_ZOOM;
      if (currentZoom < 11) {
        map.setZoom(11.5);
      }
    }
  }, [map, selectedHub]);

  useEffect(() => {
    if (!map || resetSignal === 0) return;
    map.panTo(INDIA_CENTER);
    map.setZoom(INDIA_DEFAULT_ZOOM);
  }, [map, resetSignal]);

  return null;
}

function HubMarkerWithInfoWindow({
  hub,
  isSelected,
  infoOpen,
  onSelect,
  onCloseInfo,
  onOpenQuote,
}: {
  hub: CampusHub;
  isSelected: boolean;
  infoOpen: boolean;
  onSelect: () => void;
  onCloseInfo: () => void;
  onOpenQuote?: (title?: string) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const pinStyle = getPinStyle(hub.category, isSelected);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: hub.lat, lng: hub.lng }}
        title={`${hub.city} — ${hub.title}`}
        onClick={onSelect}
        zIndex={isSelected ? 20 : 5}
      >
        <Pin
          background={pinStyle.background}
          borderColor={pinStyle.borderColor}
          glyphColor={pinStyle.glyphColor}
          scale={pinStyle.scale}
        />
      </AdvancedMarker>

      {isSelected && infoOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={270} onCloseClick={onCloseInfo}>
          <div className="text-[#161A17] p-1 space-y-1.5 font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C22768]">
              {hub.regionLabel}
            </p>
            <h4 className="text-sm font-extrabold leading-snug">{hub.city}</h4>
            <p className="text-xs text-[#4D554E] leading-snug">{hub.address}</p>
            <p className="text-[11px] font-mono-num text-[#007B36]">{hub.hours}</p>
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => onOpenQuote(`Studio Visit / Enquiry: ${hub.city}`)}
                className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#007B36] text-white text-[11px] font-bold cursor-pointer"
              >
                Book Visit / Request Quote
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapViewportWithStatus({
  hubs,
  selectedHub,
  infoOpen,
  resetSignal,
  onSelectHub,
  onCloseInfo,
  onOpenQuote,
}: {
  hubs: CampusHub[];
  selectedHub: CampusHub | null;
  infoOpen: boolean;
  resetSignal: number;
  onSelectHub: (hub: CampusHub) => void;
  onCloseInfo: () => void;
  onOpenQuote?: (title?: string) => void;
}) {
  const status = useApiLoadingStatus();
  const hasFailed =
    status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE;

  if (hasFailed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0]">
        <MapPin className="w-8 h-8 text-[#C22768] mb-2" />
        <p className="text-sm font-bold text-[#161A17]">
          Interactive map preview unavailable in this browser session
        </p>
        <p className="text-xs text-[#4D554E] mt-1 max-w-sm">
          Select any regional experience studio from the list to inspect dispatch coverage, hours, and request a local walkthrough.
        </p>
      </div>
    );
  }

  return (
    <GoogleMapCanvas
      mapId="DEMO_MAP_ID"
      defaultCenter={INDIA_CENTER}
      defaultZoom={INDIA_DEFAULT_ZOOM}
      gestureHandling="cooperative"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      <MapCameraController selectedHub={selectedHub} resetSignal={resetSignal} />
      {hubs.map((hub) => (
        <HubMarkerWithInfoWindow
          key={hub.id}
          hub={hub}
          isSelected={selectedHub?.id === hub.id}
          infoOpen={infoOpen}
          onSelect={() => onSelectHub(hub)}
          onCloseInfo={onCloseInfo}
          onOpenQuote={onOpenQuote}
        />
      ))}
    </GoogleMapCanvas>
  );
}

export function SchoolCampusMap({ onOpenQuote, compact = false }: SchoolCampusMapProps) {
  const apiKey = resolveMapsApiKey();
  const [category, setCategory] = useState<HubCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubId, setSelectedHubId] = useState<string>(REGIONAL_CAMPUS_HUBS[0].id);
  const [infoOpen, setInfoOpen] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  const filteredHubs = useMemo(
    () => filterCampusHubs(REGIONAL_CAMPUS_HUBS, category, searchQuery),
    [category, searchQuery]
  );

  const selectedHub = useMemo(
    () =>
      filteredHubs.find((h) => h.id === selectedHubId) ||
      filteredHubs[0] ||
      null,
    [filteredHubs, selectedHubId]
  );

  const handleSelectHub = (hub: CampusHub) => {
    setSelectedHubId(hub.id);
    setInfoOpen(true);
  };

  const handleResetView = () => {
    setCategory('all');
    setSearchQuery('');
    setSelectedHubId(REGIONAL_CAMPUS_HUBS[0].id);
    setInfoOpen(false);
    setResetSignal((n) => n + 1);
  };

  return (
    <section
      data-testid="campus-map-section"
      className={`border-t border-[#E5DEC9] bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F5F1E6] ${
        compact ? 'py-10 md:py-12 rounded-3xl border mt-10 px-4 md:px-6' : 'py-14 md:py-20'
      }`}
    >
      <div className={compact ? '' : 'max-w-[1320px] mx-auto px-4 md:px-6'}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.5, ease: PAGE_EASE_OUT }}
          className="flex flex-wrap items-end justify-between gap-4 mb-7"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-block w-6 h-[3px] rounded-full bg-[#C22768]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                Pan-India Studios &amp; Logistics Network
              </p>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#161A17] tracking-tight text-balance">
              Visit Our Regional{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">Experience Studios</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-[#4D554E] leading-relaxed">
              Explore live furniture mockups, test STEM phenolic worktops, and coordinate institutional dispatches from our regional hubs across India.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#161A17] text-[#161A17] hover:text-white border border-[#E5DEC9] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset India View</span>
          </button>
        </motion.div>

        {/* Interactive Hub Category Filter & City Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter studio hubs">
            {(
              [
                { id: 'all', label: 'All 5 Hubs' },
                { id: 'studio', label: 'Experience Studios' },
                { id: 'stem', label: 'STEM & Labs' },
                { id: 'dispatch', label: 'Outdoor & Supply' },
              ] as const
            ).map((pill) => {
              const active = category === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  data-testid={`map-filter-${pill.id}`}
                  aria-pressed={active}
                  onClick={() => setCategory(pill.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#161A17] text-white border-[#161A17] shadow-xs'
                      : 'bg-white text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#4D554E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or specialty..."
              aria-label="Search regional hubs"
              className="w-full h-9 pl-9 pr-3 rounded-full border border-[#E5DEC9] bg-white text-xs text-[#161A17] placeholder:text-[#4D554E]/75 focus:outline-none focus:border-[#007B36]"
            />
          </div>
        </div>

        {/* Map Canvas + Hub Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Interactive Hub Selector Cards */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[450px] overflow-y-auto pr-1">
            {filteredHubs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-[#E5DEC9] text-center space-y-2">
                <p className="text-sm font-semibold text-[#161A17]">
                  No studios match “{searchQuery}”.
                </p>
                <button
                  type="button"
                  onClick={handleResetView}
                  className="text-xs font-bold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Show all regional hubs
                </button>
              </div>
            ) : (
              filteredHubs.map((hub) => {
                const isSelected = selectedHub?.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    data-testid={`hub-card-${hub.id}`}
                    aria-pressed={isSelected}
                    onClick={() => handleSelectHub(hub)}
                    className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#007B36] shadow-md ring-1 ring-[#007B36]/20'
                        : 'bg-white/85 border-[#E5DEC9] hover:bg-white hover:border-[#161A17]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#C22768]">
                          {hub.regionLabel}
                        </p>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#161A17] mt-0.5">
                          {hub.city}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-num font-bold ${
                          isSelected
                            ? 'bg-[#EAF7EF] text-[#007B36] border border-[#BCE3CB]'
                            : 'bg-[#FAF7F0] text-[#4D554E] border border-[#E5DEC9]'
                        }`}
                      >
                        <Compass className="w-3 h-3" />
                        <span>{isSelected ? 'Focused' : 'Inspect'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#4D554E] mt-1.5 leading-snug">{hub.address}</p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {hub.specialties.slice(0, 2).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#E5DEC9] text-[10px] font-semibold text-[#161A17]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Live Google Map + Focused Studio Strip */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-[#E5DEC9] bg-white shadow-sm">
            {/* Explicit Non-Zero Height Container per Google Maps Platform CF2 */}
            <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[420px] bg-[#EEF3F7]">
              {apiKey ? (
                <APIProvider
                  apiKey={apiKey}
                  language="en"
                  region="IN"
                  libraries={['marker']}
                >
                  <MapViewportWithStatus
                    hubs={filteredHubs}
                    selectedHub={selectedHub}
                    infoOpen={infoOpen}
                    resetSignal={resetSignal}
                    onSelectHub={handleSelectHub}
                    onCloseInfo={() => setInfoOpen(false)}
                    onOpenQuote={onOpenQuote}
                  />
                </APIProvider>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0]">
                  <MapPin className="w-8 h-8 text-[#007B36] mb-2" />
                  <p className="text-sm font-bold text-[#161A17]">
                    Configure <code className="font-mono-num">VITE_GOOGLE_MAPS_API_KEY</code> to load interactive Google Map tiles
                  </p>
                  <p className="text-xs text-[#4D554E] mt-1 max-w-md">
                    Regional coordinates and hub details remain inspectable in the directory panel.
                  </p>
                </div>
              )}
            </div>

            {/* Selected Hub Action Bar */}
            {selectedHub && (
              <div
                data-testid="selected-hub-banner"
                className="p-4 sm:px-5 bg-white border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#161A17] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#007B36] shrink-0" />
                    <span className="truncate">{selectedHub.title}</span>
                  </p>
                  <p className="text-[11px] font-mono-num text-[#4D554E] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{selectedHub.hours}</span>
                  </p>
                </div>

                {onOpenQuote && (
                  <button
                    type="button"
                    data-testid="map-book-visit-btn"
                    onClick={() => onOpenQuote(`Campus Studio Walkthrough — ${selectedHub.city}`)}
                    className="px-4 py-2 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Schedule Studio Visit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
