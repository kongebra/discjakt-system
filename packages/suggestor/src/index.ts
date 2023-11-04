import { blacklist } from "./blacklist";
import { replaceRules } from "./replace-rules";

// String manipulation functions
function toLowerCase(input: string): string {
  return input.toLocaleLowerCase();
}

function removeBlacklistedWords(input: string): string {
  let result = input;
  for (const word of blacklist) {
    result = result.replace(word, "");
  }
  return result.trim();
}

function applyReplaceRule(input: string): string {
  let result = input;
  for (const [patterns, replacement] of replaceRules) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, "gi");
      result = result.replace(regex, replacement);
    }
  }
  return result;
}

// Cross-referencing logic
function getMatchingSlugs(name: string, discSlugs: string[]): string[] {
  return discSlugs.filter((slug) => name.includes(slug));
}

// Handling multiple suggestions
function performMultipleSuggestionsRules(suggestions: string[]): string[] {
  let result = [...suggestions];
  const discraftRules = ["-ss", "-os", "-gt"];
  if (suggestions.some((s) => discraftRules.some((r) => s.includes(r)))) {
    result = suggestions.filter((s) =>
      discraftRules.some((r) => s.includes(r))
    );
  }

  const kastaplastRules = ["-z"];
  if (suggestions.some((s) => kastaplastRules.some((r) => s.includes(r)))) {
    result = suggestions.filter((s) =>
      kastaplastRules.some((r) => s.includes(r))
    );
  }

  return result;
}

// Main function to get product disc suggestions
export function getProductDiscSuggestions(
  productName: string,
  discSlugs: string[]
): string[] {
  let name = toLowerCase(productName);
  name = removeBlacklistedWords(name);
  name = applyReplaceRule(name);

  let suggestions = getMatchingSlugs(name, discSlugs);

  if (suggestions.length > 1) {
    suggestions = performMultipleSuggestionsRules(suggestions);
  }

  return suggestions;
}
