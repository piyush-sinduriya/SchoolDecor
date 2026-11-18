import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map as GoogleMapCanvas,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Navigation,
  Sparkles,
  Building2,
  Factory,
  ExternalLink,
} from 'lucide-react';
import {
  REGIONAL_CAMPUS_HUBS,
  CampusHub,
  HubCategory,
  filterCampusHubs,
  getCampusHubById,
} from '../utils/campusLocations';

interface SchoolCampusMapProps {
  onBookVisit?: (city: string) => void;
  onOpenQuote?: (title?: string) => void;
}

const DEFAULT_INDIA_CENTER = { lat: 28.6304, lng: 77.2773 };

function resolveMapsApiKey(): string {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
  if (envKey && envKey !== 'YOUR_API_KEY') return envKey;
  return '';
}

function getEmbedMapUrl(hub: CampusHub): string {
  const query = hub.mapQuery || `${hub.lat},${hub.lng}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function getDirectGoogleMapsUrl(hub: CampusHub): string {
  if (hub.googleMapsUrl) return hub.googleMapsUrl;
  const query = hub.mapQuery || `${hub.title}, ${hub.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function InteractiveEmbedMapFallback({ hub }: { hub: CampusHub }) {
  const embedSrc = getEmbedMapUrl(hub);

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#EFECE6]"
      data-testid="campus-google-map-embed"
    >
      <iframe
        key={hub.id}
        title={`${hub.city} — ${hub.title} Google Map`}
        src={embedSrc}
        className="w-full h-full border-0 block"
        loading="eager"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function MapCameraUpdater({ selectedHub }: { selectedHub: CampusHub }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedHub) return;
    map.panTo({ lat: selectedHub.lat, lng: selectedHub.lng });
  }, [map, selectedHub]);

  return null;
}

function MapViewportWithStatus({
  hubs,
  selectedHub,
  infoOpen,
  onSelectHub,
  onCloseInfo,
}: {
  hubs: CampusHub[];
  selectedHub: CampusHub;
  infoOpen: boolean;
  onSelectHub: (id: string) => void;
  onCloseInfo: () => void;
}) {
  const status = useApiLoadingStatus();
  const isReady = status === APILoadingStatus.LOADED;

  if (!isReady) {
    return <InteractiveEmbedMapFallback hub={selectedHub} />;
  }

  return (
    <div className="absolute inset-0 w-full h-full" data-testid="campus-google-map-sdk">
      <GoogleMapCanvas
        defaultCenter={{
          lat: selectedHub.lat || DEFAULT_INDIA_CENTER.lat,
          lng: selectedHub.lng || DEFAULT_INDIA_CENTER.lng,
        }}
        defaultZoom={11}
        mapId="DEMO_MAP_ID"
        gestureHandling="cooperative"
        disableDefaultUI={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        <MapCameraUpdater selectedHub={selectedHub} />

        {hubs.map((hub) => {
          const isActive = hub.id === selectedHub.id;
          return (
            <AdvancedMarker
              key={hub.id}
              position={{ lat: hub.lat, lng: hub.lng }}
              title={`${hub.city} — ${hub.title}`}
              onClick={() => onSelectHub(hub.id)}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg border transition-transform cursor-pointer ${
                  isActive
                    ? 'bg-[#C85A32] text-white border-white scale-110 z-20'
                    : 'bg-[#1E1E1C] text-white border-white/30 hover:scale-105'
                }`}
              >
                {hub.category === 'dispatch' ? (
                  <Factory className="w-3.5 h-3.5 text-[#F4D35E]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#F4D35E]" />
                )}
                <span>{hub.city}</span>
              </div>
            </AdvancedMarker>
          );
        })}

        {infoOpen && selectedHub && (
          <InfoWindow
            position={{ lat: selectedHub.lat, lng: selectedHub.lng }}
            onCloseClick={onCloseInfo}
            pixelOffset={[0, -34]}
          >
            <div className="p-1 max-w-[230px] text-[#1E1E1C]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32] mb-0.5">
                {selectedHub.regionLabel}
              </p>
              <h4 className="font-serif font-bold text-sm text-[#1E1E1C] mb-1">
                {selectedHub.city} — {selectedHub.title}
              </h4>
              <p className="text-xs text-[#5C5A54] leading-snug mb-1.5">
                {selectedHub.address}
              </p>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/10">
                <p className="text-[11px] font-semibold text-[#2C4C3E]">
                  {selectedHub.hours}
                </p>
                <a
                  href={getDirectGoogleMapsUrl(selectedHub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C85A32] hover:underline"
                >
                  Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMapCanvas>
    </div>
  );
}

export const SchoolCampusMap: React.FC<SchoolCampusMapProps> = ({
  onBookVisit,
  onOpenQuote,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | HubCategory>('all');
  const [selectedHubId, setSelectedHubId] = useState<string>(REGIONAL_CAMPUS_HUBS[0].id);
  const [infoOpen, setInfoOpen] = useState<boolean>(true);
  const [usePinEmbedView, setUsePinEmbedView] = useState<boolean>(true);

  const filteredHubs = filterCampusHubs(REGIONAL_CAMPUS_HUBS, activeCategory);
  const selectedHub = getCampusHubById(
    filteredHubs.length > 0 ? filteredHubs : REGIONAL_CAMPUS_HUBS,
    selectedHubId
  );

  const apiKey = resolveMapsApiKey();

  const handleSelectHub = (id: string) => {
    setSelectedHubId(id);
    setInfoOpen(true);
  };

  return (
    <section
      id="campus-map-section"
      data-testid="campus-map-section"
      className="py-10 sm:py-14 md:py-24 px-3.5 sm:px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5DEC9]"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 md:mb-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-bold uppercase tracking-widest text-[#D95B8A] mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Corporate Head Office (Laxmi Nagar) &amp; School Decor Factory</span>
          </div>
          <h2 className="font-serif text-[22px] sm:text-3xl md:text-4xl text-[#1E1E1C] leading-[1.15]">
            Visit School Decor Office &amp; Factory
          </h2>
          <p className="text-[#5C5A54] text-xs sm:text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            Inspect our 18mm FSC birch joinery, non-toxic Montessori learning kits, and heavy-duty school furniture at our <strong>Laxmi Nagar, New Delhi Head Office</strong> or our official <strong>School Decor Factory</strong>.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'Both Locations (2)' },
            { id: 'studio', label: 'Laxmi Nagar Office' },
            { id: 'dispatch', label: 'School Decor Factory' },
          ].map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  const nextCategory = tab.id as 'all' | HubCategory;
                  setActiveCategory(nextCategory);
                  const nextList = filterCampusHubs(REGIONAL_CAMPUS_HUBS, nextCategory);
                  if (nextList.length > 0 && !nextList.some((h) => h.id === selectedHubId)) {
                    setSelectedHubId(nextList[0].id);
                  }
                }}
                className={`px-2.5 sm:px-4 py-2 rounded-lg text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                  active
                    ? 'bg-[#EE7DA8] text-white shadow-sm'
                    : 'bg-white text-[#1E1E1C] border border-[#F3DCE6] hover:border-[#EE7DA8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Hub Cards + Live Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-stretch">
        {/* Left Column: Hub Selector Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[440px] sm:max-h-[540px] overflow-y-auto pr-0.5 sm:pr-1">
          {filteredHubs.map((hub) => {
            const isSelected = hub.id === selectedHub.id;
            const isFactory = hub.category === 'dispatch';
            const isHeadOffice = hub.id === 'delhi-ncr';
            return (
              <div
                key={hub.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectHub(hub.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectHub(hub.id);
                  }
                }}
                data-testid={`campus-hub-card-${hub.id}`}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2C4C3E] text-white border-[#2C4C3E] shadow-md'
                    : 'bg-white text-[#1E1E1C] border-[#E5DEC9] hover:border-[#2C4C3E]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-1.5 ${
                        isSelected
                          ? 'bg-white/15 text-[#F4D35E]'
                          : isHeadOffice
                          ? 'bg-[#C85A32]/12 text-[#C85A32]'
                          : isFactory
                          ? 'bg-[#2C4C3E]/12 text-[#2C4C3E]'
                          : 'bg-[#F4F0EA] text-[#C85A32]'
                      }`}
                    >
                      {isFactory ? (
                        <Factory className="w-3 h-3" />
                      ) : (
                        <Building2 className="w-3 h-3" />
                      )}
                      {hub.regionLabel}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                      {hub.city}{' '}
                      <span
                        className={`text-xs sm:text-sm font-sans font-normal ${
                          isSelected ? 'text-white/80' : 'text-[#5C5A54]'
                        }`}
                      >
                        — {hub.title}
                      </span>
                    </h3>
                  </div>
                  <MapPin
                    className={`w-5 h-5 shrink-0 mt-1 ${
                      isSelected ? 'text-[#F4D35E]' : 'text-[#C85A32]'
                    }`}
                  />
                </div>

                <p
                  className={`text-xs leading-relaxed mb-3 ${
                    isSelected ? 'text-white/85' : 'text-[#5C5A54]'
                  }`}
                >
                  {hub.address}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hub.specialties.map((spec) => (
                    <span
                      key={spec}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/10 text-white'
                          : 'bg-[#FAF7F2] text-[#1E1E1C] border border-[#E5DEC9]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 shrink-0 ${
                          isSelected ? 'text-[#F4D35E]' : 'text-[#3B7A57]'
                        }`}
                      />
                      {spec}
                    </span>
                  ))}
                </div>

                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t text-xs ${
                    isSelected ? 'border-white/15 text-white/90' : 'border-[#E5DEC9] text-[#5C5A54]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {hub.hours}
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={getDirectGoogleMapsUrl(hub)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1 font-bold hover:underline ${
                        isSelected ? 'text-[#F4D35E]' : 'text-[#C85A32]'
                      }`}
                    >
                      Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="inline-flex items-center gap-1 font-bold">
                      <Phone className="w-3.5 h-3.5" /> {hub.phone}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Google Map Canvas + Selected Hub Action Bar */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-[#E5DEC9] bg-white shadow-sm">
          {apiKey && (
            <div className="px-4 py-2 bg-[#FAF7F2] border-b border-[#E5DEC9] flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C4C3E]">
                Live Google Map View
              </span>
              <div className="inline-flex rounded-lg border border-[#E5DEC9] bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setUsePinEmbedView(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    usePinEmbedView ? 'bg-[#2C4C3E] text-white' : 'text-[#5C5A54]'
                  }`}
                >
                  Pinned Place View
                </button>
                <button
                  type="button"
                  onClick={() => setUsePinEmbedView(false)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    !usePinEmbedView ? 'bg-[#2C4C3E] text-white' : 'text-[#5C5A54]'
                  }`}
                >
                  All-India Multi-Pin
                </button>
              </div>
            </div>
          )}

          <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[440px] bg-[#EFECE6]">
            {apiKey && !usePinEmbedView ? (
              <APIProvider apiKey={apiKey}>
                <MapViewportWithStatus
                  hubs={filteredHubs}
                  selectedHub={selectedHub}
                  infoOpen={infoOpen}
                  onSelectHub={handleSelectHub}
                  onCloseInfo={() => setInfoOpen(false)}
                />
              </APIProvider>
            ) : (
              <InteractiveEmbedMapFallback hub={selectedHub} />
            )}
          </div>

          {/* Bottom Bar for Selected Hub */}
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B7A57]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C4C3E]">
                  Pinned Location: {selectedHub.city}
                </span>
              </div>
              <p className="text-xs text-[#5C5A54] mt-0.5 leading-snug">{selectedHub.address}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <a
                href={getDirectGoogleMapsUrl(selectedHub)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 border border-[#2C4C3E] text-[#2C4C3E] hover:bg-[#2C4C3E] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  if (onBookVisit) {
                    onBookVisit(selectedHub.city);
                  } else if (onOpenQuote) {
                    onOpenQuote(`Visit Request — ${selectedHub.city} (${selectedHub.title})`);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#b04b25] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" /> Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
