import { blacklist } from "./blacklist";
import { replaceRules } from "./replace-rules";

// String manipulation functions
function toLowerCase(input: string): string {
  return input.toLocaleLowerCase();
}

function removeBlacklistedWords(input: string): string {
  let result = input;
  for (const word of blacklist) {
    // Escape any characters that could be misinterpreted in a regex
    const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Create a regex that includes word boundaries or space boundaries
    const regex = new RegExp(
      `\\b${escapedWord}\\b|\\s${escapedWord}\\s|\\s${escapedWord}\\b|\\b${escapedWord}\\s`,
      "gi"
    );
    result = result.replace(regex, " ");
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
  if (result.some((s) => discraftRules.some((r) => s.includes(r)))) {
    result = result.filter((s) => discraftRules.some((r) => s.includes(r)));
  }

  const kastaplastRules = ["-z"];
  if (result.some((s) => kastaplastRules.some((r) => s.includes(r)))) {
    result = result.filter((s) => kastaplastRules.some((r) => s.includes(r)));
  }

  const innovaRules = ["-x"];
  if (result.some((s) => innovaRules.some((r) => s.includes(r)))) {
    result = result.filter((s) => innovaRules.some((r) => s.includes(r)));
  }

  const latitude64Rules = ["-pro"];
  if (result.some((s) => latitude64Rules.some((r) => s.includes(r)))) {
    result = result.filter((s) => latitude64Rules.some((r) => s.includes(r)));
  }

  const dynamicDiscsRules = ["emac-", "supreme-", "sockibomb-"];
  if (result.some((s) => dynamicDiscsRules.some((r) => s.includes(r)))) {
    result = result.filter((s) => dynamicDiscsRules.some((r) => s.includes(r)));
  }

  return result;
}

function performSpecialMutiSuggestionsRules(suggestions: string[]): string[] {
  let result = [...suggestions];

  const similarNames: [string, string[]][] = [
    ["force", ["orc"]],
    ["rockstar", ["roc"]],
    ["river", ["rive"]],
    ["roc3", ["roc"]],
    ["rocx3", ["roc", "x3"]],
    ["gator3", ["gator"]],
    ["magician", ["magic"]],
    ["scorch", ["orc"]],
    ["passion", ["ion"]],
    ["aviarx3", ["aviar", "x3"]],
    ["vanguard", ["guard"]],
    ["teebird3", ["teebird", "d3"]],
    ["aviar3", ["aviar"]],
    ["leopard3", ["leopard", "d3"]],
    ["fd3", ["fd", "d3"]],
    ["fd1", ["fd", "d1"]],
    ["tl3", ["tl"]],
    ["md3", ["md", "d3"]],
    ["stalker", ["stal"]],
    ["dd3", ["d3"]],
    ["atlas", ["tl"]],
  ];
  for (const [name, slugs] of similarNames) {
    if (result.includes(name)) {
      result = result.filter((s) => !slugs.includes(s));
    }
  }

  if (result.length > 1) {
    // Add to this list, if there are multiple suggestions after other filters
    // Common for these; they are short names, name of a disc that is also a plastic type,
    // or the name is a common word
    const knownShortnames = [
      "ion",
      "it",
      "fl",
      "tl",
      "sol",
      "cro",
      "stal", // TODO: test this more
      "nova",
      // plastics
      "cosmic",
      "dragon",
      "diamond",
      "raptor",
      // brands
      "viking",
    ];

    result = result.filter((s) => !knownShortnames.includes(s));
  }

  return result;
}

function exactWordRules(productName: string, suggestions: string[]): string[] {
  let result = [...suggestions];

  // Check if the suggestions is "it" / "ion"
  const doubleChecks = ["it", "ion", "stal"];
  for (const check of doubleChecks) {
    if (result.includes(check)) {
      const words = productName.split(" ");
      // Check if we any any word that actually is "it"
      if (!words.some((word) => word === check)) {
        result = result.filter((s) => s !== check);
      }
    }
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

  suggestions = exactWordRules(name, suggestions);

  if (suggestions.length > 1) {
    suggestions = performMultipleSuggestionsRules(suggestions);
  }

  if (suggestions.length > 1) {
    suggestions = performSpecialMutiSuggestionsRules(suggestions);
  }

  return suggestions;
}
