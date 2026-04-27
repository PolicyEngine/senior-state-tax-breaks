import { useDeferredValue, useEffect, useState } from "react";
import USMap from "./components/USMap";
import { JURISDICTIONS } from "./data/stateMeta";
import { parseCsv } from "./lib/csv";
import { colors } from "./policyengineTheme";

const ACTIVE_STATUS = "included_active_2026";

const STATUS_LABELS = {
  included_active_2026: "Active in 2026",
  excluded_from_active_2026: "Excluded from active 2026",
};

const RELEVANCE_LABELS = {
  premium: "Age changes the amount",
  age_only_eligibility: "Age is the main eligibility test",
  age_or_other_eligibility: "Age is one path to eligibility",
  not_active_or_not_modeled: "Not active or not modeled",
};

const DETAIL_FILTERS = [
  { key: "all", label: "All entries" },
  { key: "active", label: "Active only" },
  { key: "excluded", label: "Excluded only" },
];

const LEGEND = [
  { label: "No entry in CSV", color: colors.gray[100] },
  { label: "Only excluded / unmodeled", color: colors.gray[300] },
  { label: "1 active break", color: colors.primary[100] },
  { label: "2 active breaks", color: colors.primary[300] },
  { label: "3+ active breaks", color: colors.primary[700] },
];

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getFill(summary) {
  if (summary.activeCount >= 3) {
    return colors.primary[700];
  }
  if (summary.activeCount === 2) {
    return colors.primary[500];
  }
  if (summary.activeCount === 1) {
    return colors.primary[100];
  }
  if (summary.excludedCount > 0) {
    return colors.gray[300];
  }
  return colors.gray[100];
}

function buildJurisdictionIndex(rows) {
  const index = Object.fromEntries(
    JURISDICTIONS.map(({ abbr, name }) => [
      abbr,
      {
        abbr,
        name,
        entries: [],
        activeEntries: [],
        excludedEntries: [],
        activeCount: 0,
        excludedCount: 0,
      },
    ]),
  );

  rows.forEach((row) => {
    const summary = index[row.state];
    if (!summary) {
      return;
    }

    summary.entries.push(row);
    if (row.status === ACTIVE_STATUS) {
      summary.activeEntries.push(row);
    } else {
      summary.excludedEntries.push(row);
    }
  });

  Object.values(index).forEach((summary) => {
    summary.entries.sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === ACTIVE_STATUS ? -1 : 1;
      }
      return left.credit_name.localeCompare(right.credit_name);
    });
    summary.activeEntries.sort((left, right) =>
      left.credit_name.localeCompare(right.credit_name),
    );
    summary.excludedEntries.sort((left, right) =>
      left.credit_name.localeCompare(right.credit_name),
    );
    summary.activeCount = summary.activeEntries.length;
    summary.excludedCount = summary.excludedEntries.length;
    summary.totalCount = summary.entries.length;
  });

  return index;
}

function getDetailEntries(summary, filter) {
  if (filter === "active") {
    return summary.activeEntries;
  }
  if (filter === "excluded") {
    return summary.excludedEntries;
  }
  return summary.entries;
}

function App() {
  const [jurisdictions, setJurisdictions] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailFilter, setDetailFilter] = useState("all");
  const [error, setError] = useState(null);

  const deferredSearch = useDeferredValue(searchTerm);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/senior_state_tax_breaks_2026.csv");
        if (!response.ok) {
          throw new Error(`Failed to load CSV (${response.status})`);
        }
        const csvText = await response.text();
        const parsedRows = parseCsv(csvText);
        const nextJurisdictions = buildJurisdictionIndex(parsedRows);
        const mostActive = Object.values(nextJurisdictions).sort((left, right) => {
          if (right.activeCount !== left.activeCount) {
            return right.activeCount - left.activeCount;
          }
          if (right.totalCount !== left.totalCount) {
            return right.totalCount - left.totalCount;
          }
          return left.name.localeCompare(right.name);
        })[0];

        setRows(parsedRows);
        setJurisdictions(nextJurisdictions);
        setSelectedState(mostActive?.abbr ?? "AL");
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadData();
  }, []);

  if (error) {
    return (
      <main className="page-shell">
        <section className="panel error-panel">
          <p className="eyebrow">Data load error</p>
          <h1>We couldn’t open the 2026 tax-break CSV.</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!jurisdictions || !selectedState) {
    return (
      <main className="page-shell">
        <section className="panel loading-panel">
          <p className="eyebrow">Loading</p>
          <h1>Building the state map from the CSV.</h1>
          <p>Parsing the 2026 snapshot and grouping entries by state.</p>
        </section>
      </main>
    );
  }

  const selectedSummary = jurisdictions[selectedState];
  const detailEntries = getDetailEntries(selectedSummary, detailFilter);
  const searchValue = deferredSearch.trim().toLowerCase();
  const listItems = Object.values(jurisdictions)
    .filter((summary) => {
      if (!searchValue) {
        return true;
      }
      return (
        summary.name.toLowerCase().includes(searchValue) ||
        summary.abbr.toLowerCase().includes(searchValue)
      );
    })
    .sort((left, right) => {
      if (right.activeCount !== left.activeCount) {
        return right.activeCount - left.activeCount;
      }
      if (right.totalCount !== left.totalCount) {
        return right.totalCount - left.totalCount;
      }
      return left.name.localeCompare(right.name);
    });

  const activeRows = rows.filter((row) => row.status === ACTIVE_STATUS);
  const activeJurisdictionCount = Object.values(jurisdictions).filter(
    (summary) => summary.activeCount > 0,
  ).length;
  const excludedOnlyCount = Object.values(jurisdictions).filter(
    (summary) => summary.activeCount === 0 && summary.excludedCount > 0,
  ).length;
  const propertyCount = activeRows.filter((row) => row.credit_type === "property").length;
  const ageOnlyCount = activeRows.filter(
    (row) => row.age_relevance === "age_only_eligibility",
  ).length;
  const snapshotDate = rows[0]?.policy_date ? formatDate(rows[0].policy_date) : "2026 snapshot";
  const focusState = hoveredState ? jurisdictions[hoveredState] : selectedSummary;

  return (
    <main className="page-shell">
      <header className="site-header">
        <a
          className="brand-lockup"
          href="https://policyengine.org"
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="brand-mark"
            src="/assets/logos/policyengine/teal-square.svg"
            alt=""
            aria-hidden="true"
          />
          <img
            className="brand-wordmark"
            src="/assets/logos/policyengine/teal.svg"
            alt="PolicyEngine"
          />
        </a>
        <span className="site-tag">Senior State Tax Breaks</span>
      </header>

      <section className="panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">PolicyEngine state tax map</p>
          <h1>See where age-linked state tax breaks show up in the CSV.</h1>
          <p className="hero-text">
            This view turns the 2026 state tax-break snapshot into an interactive U.S.
            map. Darker teal states have more active senior-focused provisions in the
            CSV, while gray states only show excluded or unmodeled entries.
          </p>
        </div>

        <div className="hero-meta">
          <div className="meta-chip">
            <span>Snapshot date</span>
            <strong>{snapshotDate}</strong>
          </div>
          <div className="meta-chip">
            <span>Focus state</span>
            <strong>{focusState.name}</strong>
          </div>
        </div>

        <div className="summary-grid">
          <article className="summary-card">
            <span>States + DC with active breaks</span>
            <strong>{activeJurisdictionCount}</strong>
          </article>
          <article className="summary-card">
            <span>Active programs in the CSV</span>
            <strong>{activeRows.length}</strong>
          </article>
          <article className="summary-card">
            <span>Property-tax programs</span>
            <strong>{propertyCount}</strong>
          </article>
          <article className="summary-card">
            <span>Age-only eligibility programs</span>
            <strong>{ageOnlyCount}</strong>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel map-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Map</p>
              <h2>Active credits cluster in a limited set of states.</h2>
            </div>
            <p className="section-note">
              {excludedOnlyCount} jurisdictions appear only as excluded or unmodeled in this
              snapshot.
            </p>
          </div>

          <div className="legend" aria-label="Map legend">
            {LEGEND.map((item) => (
              <div className="legend-item" key={item.label}>
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <USMap
            jurisdictions={jurisdictions}
            selectedState={selectedState}
            hoveredState={hoveredState}
            onStateHover={setHoveredState}
            onStateSelect={setSelectedState}
            getFill={getFill}
          />

          <p className="map-caption">
            Click a state for the full entry list. Hovering temporarily previews that
            jurisdiction in the header.
          </p>
        </section>

        <aside className="panel list-panel">
          <div className="section-head compact">
            <div>
              <p className="eyebrow">State index</p>
              <h2>Jump to a state.</h2>
            </div>
          </div>

          <label className="search-field">
            <span>Search states</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try NJ, New Mexico, DC..."
            />
          </label>

          <div className="state-list" role="list">
            {listItems.map((summary) => (
              <button
                key={summary.abbr}
                type="button"
                className={`state-row ${summary.abbr === selectedState ? "selected" : ""}`}
                onClick={() => setSelectedState(summary.abbr)}
              >
                <span className="state-row-main">
                  <span className="state-abbr">{summary.abbr}</span>
                  <span className="state-name">{summary.name}</span>
                </span>
                <span className="state-row-stats">
                  <span className="state-count active">{summary.activeCount} active</span>
                  <span className="state-count muted">{summary.excludedCount} excluded</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="panel detail-panel">
          <div className="detail-top">
            <div>
              <p className="eyebrow">Selected state</p>
              <h2>{selectedSummary.name}</h2>
              <p className="detail-summary">
                {selectedSummary.totalCount > 0
                  ? `${selectedSummary.activeCount} active and ${selectedSummary.excludedCount} excluded entries in the snapshot.`
                  : "No state-specific entries appear in this CSV snapshot."}
              </p>
            </div>

            <div className="filter-group" role="tablist" aria-label="Detail filters">
              {DETAIL_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`filter-chip ${detailFilter === filter.key ? "active" : ""}`}
                  onClick={() => setDetailFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {detailEntries.length === 0 ? (
            <div className="empty-state">
              <p>No entries match this filter for {selectedSummary.name}.</p>
            </div>
          ) : (
            <div className="entry-grid">
              {detailEntries.map((entry) => (
                <article className="entry-card" key={`${entry.state}-${entry.credit_name}-${entry.status}`}>
                  <div className="entry-head">
                    <span
                      className={`status-pill ${
                        entry.status === ACTIVE_STATUS ? "active" : "excluded"
                      }`}
                    >
                      {STATUS_LABELS[entry.status]}
                    </span>
                    <span className="type-pill">{entry.credit_type}</span>
                  </div>

                  <h3>{entry.credit_name}</h3>
                  <p className="entry-value">{entry.age_attributable_value_2026}</p>

                  <dl className="entry-details">
                    <div>
                      <dt>Age rule</dt>
                      <dd>{entry.age_threshold_or_test}</dd>
                    </div>
                    <div>
                      <dt>Interpretation</dt>
                      <dd>{RELEVANCE_LABELS[entry.age_relevance]}</dd>
                    </div>
                    <div>
                      <dt>Notes</dt>
                      <dd>{entry.notes}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
