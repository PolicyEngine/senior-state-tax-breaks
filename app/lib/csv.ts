export type CsvRow = Record<string, string>;

export function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    const next = text[i + 1];

    if (character === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += character;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const filtered = rows.filter((values) =>
    values.some((value) => value.trim().length > 0),
  );
  const [headers, ...dataRows] = filtered;

  if (!headers) {
    return [];
  }

  return dataRows.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [header, (values[index] ?? "").trim()]),
    ),
  );
}
