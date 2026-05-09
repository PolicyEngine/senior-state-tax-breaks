import { JURISDICTIONS } from "../data/stateMeta";
import type { CsvRow } from "./csv";

export const ACTIVE_STATUS = "included_active_2026";

export interface JurisdictionSummary {
  abbr: string;
  name: string;
  entries: CsvRow[];
  activeEntries: CsvRow[];
  excludedEntries: CsvRow[];
  activeCount: number;
  excludedCount: number;
  totalCount: number;
}

export function buildJurisdictionIndex(
  rows: CsvRow[],
): Record<string, JurisdictionSummary> {
  const index: Record<string, JurisdictionSummary> = Object.fromEntries(
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
        totalCount: 0,
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
