import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const charMap = [
  ["å", "a"],
  ["ä", "a"],
  ["ö", "o"],
  ["ü", "u"],
  ["ß", "ss"],
  ["ø", "o"],
  ["æ", "ae"],
  ["é", "e"],
  ["è", "e"],
  ["ë", "e"],
  ["ê", "e"],
  ["í", "i"],
  ["ì", "i"],
  ["ï", "i"],
  ["î", "i"],
];

export function slugify(text: string) {
  if (!text) {
    throw new Error("Invalid text provided for slugification");
  }

  let result = text.toString().toLowerCase();

  for (const [char, replacement] of charMap) {
    const regex = new RegExp(char, "g");
    result = result.replace(regex, replacement);
  }

  result = result
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

  return result;
}
