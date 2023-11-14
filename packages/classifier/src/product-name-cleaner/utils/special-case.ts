import { SpecialCase } from "../types/special-case";
import { escapeRegExp } from "./regex";

// Function to build a regex for special cases
export function buildSpecialCasesRegex(specialCases: SpecialCase[]) {
  return specialCases.map((caseItem) => {
    let {
      match,
      boundary,
      followedBy,
      precededBy,
      notFollowedBy,
      replaceWith,
      customReplaceFunction,
    } = caseItem;
    let pattern = escapeRegExp(match);

    // Apply word boundaries
    if (boundary === "word") {
      pattern = `\\b${pattern}\\b`;
    } else if (boundary === "start") {
      pattern = `^${pattern}`;
    } else if (boundary === "end") {
      pattern = `${pattern}$`;
    }

    // Apply conditions for what may follow the match
    if (followedBy === "capital") {
      pattern += `(?=\\s+[A-Z])`;
    } else if (followedBy === "number") {
      pattern += `(?=\\s+\\d)`;
    } // Add more conditions as necessary

    // Apply conditions for what may precede the match
    if (precededBy === "specialChar") {
      pattern = `(?<=\\W)${pattern}`;
    } // Add more conditions as necessary

    // Apply negative lookahead for notFollowedBy
    if (notFollowedBy) {
      pattern += `(?!${escapeRegExp(notFollowedBy)})`;
    }

    // If a custom replacement function is provided, use it
    if (customReplaceFunction) {
      // This custom function logic will need to be handled separately,
      // as regex alone won't execute a function
      return { pattern: new RegExp(pattern, "g"), customReplaceFunction };
    }

    // If a specific replacement string is provided, use it
    if (replaceWith) {
      return { pattern: new RegExp(pattern, "g"), replaceWith };
    }

    // Otherwise, just create the regex pattern for removal
    return { pattern: new RegExp(pattern, "g") };
  });
}
