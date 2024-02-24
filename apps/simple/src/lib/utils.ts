import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseCSV(data: string, delimiter = ",", hasHeader = true) {
  const lines = data.replaceAll("\r", "").split("\n");
  const headers = lines
    .shift()!
    .split(",")
    .map((header) => header.replaceAll('"', "").trim());

  const rows = lines.map((line) =>
    line.split('",').map((cell) => cell.replaceAll('"', "")),
  );

  const result = rows.map((row) => {
    const obj: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = row[i];
    }
    return obj;
  });

  return result;
}

export function slugify(text: string) {
  if (!text) {
    return "";
  }

  let result = text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[åäàá]/g, "a")
    .replace(/[øöòó]/g, "o")
    .replace(/[æ]/g, "ae")
    .replace(/[ü]/g, "u")
    .replace(/[ß]/g, "ss")
    .replace(/[êëèé]/g, "e")
    .replace(/[îíìï]/g, "i")
    .replace(/\+/g, "-plus-")
    .replace(/\#/g, "-number-")
    .replace(/[^a-z0-9-]/g, "");

  while (result.includes("--")) {
    result = result.replace("--", "-");
  }

  if (result.startsWith("-")) {
    result = result.slice(1);
  }

  if (result.endsWith("-")) {
    result = result.slice(0, -1);
  }

  return result;
}

export function parsePDGAApproveDate(input: string): string {
  if (!input) {
    return "";
  }

  const date = new Date(input);

  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T00:00:00Z`;
}

