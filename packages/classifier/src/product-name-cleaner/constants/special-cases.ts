import { SpecialCase } from "../types/special-case";

// Define an array for special cases
export const specialCases: SpecialCase[] = [
  { match: "z", boundary: "word" }, // 'z' as a standalone word followed by a capitalized word
  { match: "x", boundary: "word" },
  { match: "uv", boundary: "word" },
  { match: "sl", boundary: "word" },
  { match: "esp", boundary: "word" }, // 'esp' as a standalone word
  { match: "glo", boundary: "word" }, // 'glo' as a standalone word

  // westside
  { match: "bt", boundary: "word" },
];
