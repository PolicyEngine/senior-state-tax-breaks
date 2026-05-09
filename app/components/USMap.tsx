"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { FIPS_TO_ABBR, STATE_NAMES } from "../data/stateMeta";
import { colors } from "../lib/policyengineTheme";
import type { JurisdictionSummary } from "../lib/jurisdictions";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USMapProps {
  jurisdictions: Record<string, JurisdictionSummary>;
  selectedState: string | null;
  hoveredState: string | null;
  onStateHover: (abbr: string | null) => void;
  onStateSelect: (abbr: string) => void;
  getFill: (summary: JurisdictionSummary) => string;
}

export default function USMap({
  jurisdictions,
  selectedState,
  hoveredState,
  onStateHover,
  onStateSelect,
  getFill,
}: USMapProps) {
  return (
    <div className="map-shell">
      <ComposableMap
        projection="geoAlbersUsa"
        className="us-map"
        aria-label="United States map showing senior tax breaks by state"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = String(geo.id).padStart(2, "0");
              const abbr = FIPS_TO_ABBR[fips];

              if (!abbr) {
                return null;
              }

              const summary = jurisdictions[abbr];
              const fill = getFill(summary);
              const isSelected = selectedState === abbr;
              const isHovered = hoveredState === abbr;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={0}
                  role="button"
                  aria-label={`${STATE_NAMES[abbr]}: ${summary.activeCount} active, ${summary.excludedCount} excluded`}
                  className="state-shape"
                  onClick={() => onStateSelect(abbr)}
                  onFocus={() => onStateHover(abbr)}
                  onBlur={() => onStateHover(null)}
                  onMouseEnter={() => onStateHover(abbr)}
                  onMouseLeave={() => onStateHover(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onStateSelect(abbr);
                    }
                  }}
                  style={{
                    default: {
                      fill,
                      stroke: isSelected
                        ? colors.primary[700]
                        : colors.background.primary,
                      strokeWidth: isSelected ? 2.2 : isHovered ? 1.4 : 0.9,
                      outline: "none",
                    },
                    hover: {
                      fill,
                      stroke: colors.primary[600],
                      strokeWidth: 1.8,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill,
                      stroke: colors.primary[700],
                      strokeWidth: 2.2,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
