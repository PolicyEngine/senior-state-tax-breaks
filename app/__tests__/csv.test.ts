import { describe, expect, it } from "vitest";
import { parseCsv } from "../lib/csv";

describe("parseCsv", () => {
  it("parses a simple CSV with headers and rows", () => {
    const csv = "a,b,c\n1,2,3\n4,5,6\n";
    expect(parseCsv(csv)).toEqual([
      { a: "1", b: "2", c: "3" },
      { a: "4", b: "5", c: "6" },
    ]);
  });

  it("handles quoted fields with embedded commas", () => {
    const csv = 'name,note\n"Smith, John","hello, world"\n';
    expect(parseCsv(csv)).toEqual([
      { name: "Smith, John", note: "hello, world" },
    ]);
  });

  it("handles escaped double quotes inside quoted fields", () => {
    const csv = 'a,b\n"he said ""hi""",x\n';
    expect(parseCsv(csv)).toEqual([{ a: 'he said "hi"', b: "x" }]);
  });

  it("trims whitespace from non-quoted cells", () => {
    const csv = "a,b\n  hello , world  \n";
    expect(parseCsv(csv)).toEqual([{ a: "hello", b: "world" }]);
  });

  it("skips blank rows", () => {
    const csv = "a,b\n1,2\n\n3,4\n";
    expect(parseCsv(csv)).toEqual([
      { a: "1", b: "2" },
      { a: "3", b: "4" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });
});
