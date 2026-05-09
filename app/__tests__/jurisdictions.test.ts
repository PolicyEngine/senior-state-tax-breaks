import { describe, expect, it } from "vitest";
import {
  ACTIVE_STATUS,
  buildJurisdictionIndex,
} from "../lib/jurisdictions";

describe("buildJurisdictionIndex", () => {
  it("returns a summary entry for every JURISDICTION even with no rows", () => {
    const index = buildJurisdictionIndex([]);
    expect(Object.keys(index)).toContain("CA");
    expect(Object.keys(index)).toContain("DC");
    expect(index.CA.activeCount).toBe(0);
    expect(index.CA.excludedCount).toBe(0);
    expect(index.CA.totalCount).toBe(0);
  });

  it("groups rows by state and counts active vs excluded", () => {
    const rows = [
      {
        state: "CA",
        status: ACTIVE_STATUS,
        credit_name: "Senior credit",
      },
      {
        state: "CA",
        status: "excluded_from_active_2026",
        credit_name: "Old credit",
      },
      {
        state: "NY",
        status: ACTIVE_STATUS,
        credit_name: "STAR",
      },
    ];

    const index = buildJurisdictionIndex(rows);

    expect(index.CA.activeCount).toBe(1);
    expect(index.CA.excludedCount).toBe(1);
    expect(index.CA.totalCount).toBe(2);
    expect(index.NY.activeCount).toBe(1);
    expect(index.NY.excludedCount).toBe(0);
  });

  it("ignores rows whose state is not in the JURISDICTIONS list", () => {
    const rows = [
      { state: "ZZ", status: ACTIVE_STATUS, credit_name: "Mystery" },
    ];

    const index = buildJurisdictionIndex(rows);

    expect(index.ZZ).toBeUndefined();
    expect(index.CA.activeCount).toBe(0);
  });

  it("sorts active entries before excluded, then alphabetically", () => {
    const rows = [
      {
        state: "CA",
        status: "excluded_from_active_2026",
        credit_name: "Beta excluded",
      },
      {
        state: "CA",
        status: ACTIVE_STATUS,
        credit_name: "Beta active",
      },
      {
        state: "CA",
        status: ACTIVE_STATUS,
        credit_name: "Alpha active",
      },
    ];

    const index = buildJurisdictionIndex(rows);
    expect(index.CA.entries.map((e) => e.credit_name)).toEqual([
      "Alpha active",
      "Beta active",
      "Beta excluded",
    ]);
  });
});
