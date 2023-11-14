import { SpecialCase } from "../types/special-case";

// Define an array for special cases
export const specialCases: SpecialCase[] = [
  { match: "z", boundary: "word" }, // 'z' as a standalone word followed by a capitalized word
  { match: "esp", boundary: "word" }, // 'esp' as a standalone word
];
