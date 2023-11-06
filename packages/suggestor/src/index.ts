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
  return discSlugs.filter((slug) => {
    // if (slug.length < 3) {
    //   const words = name.split(" ");

    //   return words.some((word) => word === slug);
    // }

    return name.includes(slug);
  });
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
    // Latitude 64
    ["river", ["rive"]],
    // Westside
    ["underworld", ["world", "under"]],
    // Dynamic Discs
    ["escape", ["ape"]],
    ["sockibomb-slammer", ["slammer"]],
    // Innova
    ["roc3", ["roc", "f2"]],
    ["rocx3", ["roc", "f2"]],
    ["mako3", ["mako", "f2"]],
    ["viking", ["king", "f2"]],
    ["gator3", ["gator", "f2"]],
    ["aviar3", ["aviar", "f2"]],
    ["shark3", ["shark", "f2"]],
    ["aviarx3", ["aviar", "f2"]],
    ["kc-aviar", ["aviar", "f2"]],
    ["wombat3", ["wombat", "f2"]],
    ["teebird3", ["teebird", "f2"]],
    ["leopard3", ["leopard", "f2"]],
    ["phantom-sword", ["sword", "f2"]],
    ["eagle", ["star", "halo", "f2"]],
    // Discraft
    ["force", ["orc"]],
    ["scorch", ["orc"]],
    ["passion", ["ion"]],
    ["stalker", ["stal"]],
    ["captains-raptor", ["captain", "raptor"]],
    // Prodigy
    ["d2-max", ["d2", "max"]],
    ["d3-max", ["d3", "max"]],
    ["d4-max", ["d4", "max"]],
    ["h1-v2", ["h1"]],
    ["h2-v2", ["h2"]],
    ["h3-v2", ["h3"]],
    ["h4-v2", ["h4"]],
    // Discmania
    ["fd1", ["fd", "d1"]],
    ["cd1", ["cd", "d1"]],
    ["cd3", ["cd", "d3"]],
    ["md1", ["md", "d1"]],
    ["md3", ["md", "d3"]],
    ["md4", ["md", "d4"]],
    ["md5", ["md"]],
    ["pd3", ["pd"]],
    ["p3x", ["p3"]],
    ["rockstar", ["roc"]],
    ["magician", ["magic"]],
    ["vanguard", ["guard"]],
    ["p1x", ["p1"]],
    ["logic", ["fury"]],
    // Thought Space Athletics
    ["synapse", ["nebula"]],

    // edge cases
    ["link", ["dd3"]],
    ["wizard", ["diamond"]],
    ["force", ["fl"]],
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
      "d1",
      "d2",
      "d3",
      "md",
      "fd",
      "pd",
      "td",
      "dd",
      "x3",
      "it",
      "fl",
      "tl",
      "xl",
      "hu",
      "fu",
      "ion",
      "sol",
      "cro",
      "rat",
      "ape",
      "roc",
      "stal",
      "lion",
      "king",
      "halo",
      "nova",
      "jarn",
      "reko",
      "force",
      "zion",
      "eagle",
      "world",
      "spark",
      "wizard",
      "scorch",
      "astronaut",
      // plastics
      "cosmic",
      "dragon",
      "diamond",
      "raptor",
      // brands
      "viking",
    ];

    // TODO: Check if any of the suggestions are just a partial word

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

function noMatchesRules(name: string, discSlugs: string[]): string[] {
  if (name.includes("swan")) {
    return ["swan-2"];
  }

  return [];
}

// Main function to get product disc suggestions
export function getProductDiscSuggestions(
  productName: string,
  discSlugs: string[]
): string[] {
  let name = toLowerCase(productName);
  name = applyReplaceRule(name);
  name = removeBlacklistedWords(name);

  let suggestions = getMatchingSlugs(name, discSlugs);
  // if (suggestions.length > 1) {
  //   const words = name.split(" ");
  //   // Check if any of the suggestions is a partial word, if so, remove them
  //   for (const suggestion of suggestions) {
  //     if (!words.includes(suggestion)) {
  //       suggestions = suggestions.filter((s) => s !== suggestion);
  //     }
  //   }
  // }

  suggestions = exactWordRules(name, suggestions);

  if (suggestions.length > 1) {
    suggestions = performMultipleSuggestionsRules(suggestions);
  }

  if (suggestions.length > 1) {
    suggestions = performSpecialMutiSuggestionsRules(suggestions);
  }

  if (suggestions.length === 0) {
    suggestions = noMatchesRules(name, discSlugs);
  }

  return suggestions;
}
