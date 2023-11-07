import { blacklist } from "./blacklist";
import { replaceRules } from "./replace-rules";
import { Span, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("discjakt-suggestor");

// String manipulation functions
function toLowerCase(input: string): string {
  return input.toLocaleLowerCase();
}

function removeBlacklistedWords(input: string): string {
  return tracer.startActiveSpan("removeBlacklistedWords", (span: Span) => {
    let result = input;
    for (const word of blacklist) {
      // Escape any characters that could be misinterpreted in a regex
      const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      // Create a regex that includes word boundaries or space boundaries
      const regex = new RegExp(
        `\\b${escapedWord}\\b|\\s${escapedWord}\\s|\\s${escapedWord}\\b|\\b${escapedWord}\\s`,
        "gi"
      );
      result = result.replaceAll(regex, " ");
    }

    span.end();
    return result.trim();
  });
}

function applyReplaceRule(input: string): string {
  return tracer.startActiveSpan("applyReplaceRule", (span: Span) => {
    let result = input;
    for (const [patterns, replacement] of replaceRules) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, "gi");
        result = result.replace(regex, replacement);
      }
    }

    span.end();
    return result;
  });
}

// Cross-referencing logic
function getMatchingSlugs(name: string, discSlugs: string[]): string[] {
  return tracer.startActiveSpan("getMatchingSlugs", (span: Span) => {
    const result = discSlugs.filter((slug) => {
      // if (slug.length < 3) {
      //   const words = name.split(" ");

      //   return words.some((word) => word === slug);
      // }

      return name.includes(slug);
    });

    span.end();

    return result;
  });
}

// Handling multiple suggestions
function performMultipleSuggestionsRules(suggestions: string[]): string[] {
  return tracer.startActiveSpan(
    "performMultipleSuggestionsRules",
    (span: Span) => {
      let result = [...suggestions];

      const discraftRules = ["-ss", "-os", "-gt"];
      if (result.some((s) => discraftRules.some((r) => s.includes(r)))) {
        result = result.filter((s) => discraftRules.some((r) => s.includes(r)));
      }

      const kastaplastRules = ["-z"];
      if (result.some((s) => kastaplastRules.some((r) => s.includes(r)))) {
        result = result.filter((s) =>
          kastaplastRules.some((r) => s.includes(r))
        );
      }

      const innovaRules = ["-x"];
      if (result.some((s) => innovaRules.some((r) => s.includes(r)))) {
        result = result.filter((s) => innovaRules.some((r) => s.includes(r)));
      }

      const latitude64Rules = ["-pro"];
      if (result.some((s) => latitude64Rules.some((r) => s.includes(r)))) {
        result = result.filter((s) =>
          latitude64Rules.some((r) => s.includes(r))
        );
      }

      const dynamicDiscsRules = ["emac-", "supreme-", "sockibomb-"];
      if (result.some((s) => dynamicDiscsRules.some((r) => s.includes(r)))) {
        result = result.filter((s) =>
          dynamicDiscsRules.some((r) => s.includes(r))
        );
      }

      span.end();
      return result;
    }
  );
}

function performSpecialMutiSuggestionsRules(suggestions: string[]): string[] {
  return tracer.startActiveSpan(
    "performSpecialMutiSuggestionsRules",
    (span: Span) => {
      let result = [...suggestions];

      const similarNames: [string, string[]][] = [
        // Latitude 64
        ["river", ["rive"]],
        ["flow", ["fl"]],
        ["compass", ["amp"]],
        ["striker", ["strike"]],
        // Westside
        ["underworld", ["world", "under"]],
        ["sorcerer", ["orc"]],
        // Dynamic Discs
        ["escape", ["ape"]],
        ["sockibomb-slammer", ["slammer"]],
        ["enforcer", ["force", "orc"]],
        // Kastaplast
        ["kaxe", ["axe"]],
        ["kaxe-z", ["axe", "kaxe"]],
        // Innova
        ["roc", ["xl"]],
        ["rat", ["xl"]],
        ["roc3", ["roc"]],
        ["vroc", ["roc"]],
        ["rocx3", ["roc", "x3"]],
        ["mako3", ["mako"]],
        ["viking", ["king"]],
        ["gator3", ["gator"]],
        ["aviar3", ["aviar"]],
        ["shark3", ["shark"]],
        ["aviarx3", ["aviar", "x3"]],
        ["kc-aviar", ["aviar"]],
        ["wombat3", ["wombat"]],
        ["teebird", ["f2", "barbarian"]],
        ["teebird3", ["teebird"]],
        ["leopard3", ["leopard"]],
        ["phantom-sword", ["sword"]],
        ["eagle", ["star", "halo"]],
        ["hawkeye", ["hawk"]],
        ["stingray", ["sting"]],
        ["rat", ["star", "ra"]],
        ["dark-rebel", ["rebel"]],
        ["destroyer", ["raptor"]],
        ["lion", ["halo"]],
        // Discraft
        ["force", ["orc"]],
        ["scorch", ["orc"]],
        ["passion", ["ion"]],
        ["stalker", ["stal"]],
        ["captains-raptor", ["captain", "raptor"]],
        ["buzzz", ["nebula"]],
        ["zone", ["x5"]],
        ["wrath", ["rat"]],
        ["rattler", ["rat"]],
        // Prodigy
        ["d3", ["lion", "fl"]],
        ["d1-max", ["d1", "max"]],
        ["d2-max", ["d2", "max"]],
        ["d3-max", ["d3", "max"]],
        ["d4-max", ["d4", "max"]],
        ["h1-v2", ["h1", "spectrum"]],
        ["h2-v2", ["h2", "spectrum"]],
        ["h3-v2", ["h3", "spectrum"]],
        ["h4-v2", ["h4", "spectrum"]],
        ["spectrum", ["a3"]],
        ["f5", ["shark"]],
        ["a2", ["spectrum"]],
        ["pa-4", ["spectrum"]],
        ["pa-5", ["spectrum", "count"]],
        ["fx-2", ["spectrum"]],
        ["f7", ["spectrum"]],
        ["pa-3", ["spectrum"]],
        ["x3", ["spectrum"]],
        // Discmania
        ["fd1", ["fd", "d1"]],
        ["cd1", ["cd", "d1"]],
        ["cd2", ["cd", "d2"]],
        ["cd3", ["cd", "d3"]],
        ["md1", ["md", "d1"]],
        ["md3", ["md", "d3", "bear", "crown"]],
        ["md4", ["md", "d4"]],
        ["md5", ["md", "d5"]],
        ["pd3", ["pd"]],
        ["p1x", ["wings"]],
        ["p3x", ["p3", "d3"]],
        ["dd3", ["echo"]],
        ["rockstar", ["roc"]],
        ["magician", ["magic"]],
        ["vanguard", ["guard"]],
        ["p1x", ["p1"]],
        ["logic", ["fury"]],
        ["method", ["titan"]],
        ["fd", ["hu"]],
        ["pd", ["phenom"]],
        ["cd", ["raze"]],
        // Thought Space Athletics
        ["synapse", ["nebula"]],
        ["animus", ["nebula"]],
        ["praxis", ["axis", "nebula"]],
        // MVP
        ["nomad", ["wolf"]],
        ["photon", ["max"]],
        ["relay", ["cosmic"]],
        // Guru
        ["flow-motion", ["flow", "motion"]],
        // Yikun
        ["kui", ["dragon"]],
        ["kotuku", ["cosmic"]],
        // RPM
        ["pekapeka", ["rat"]],
        ["kea", ["rat"]],
        // Divergant
        ["tiyanak", ["yan"]],
        // Legacy
        ["rampage", ["amp"]],
        // Clash
        ["peppermint", ["pepper", "mint"]],
        // Viking
        ["nordic-warrior", ["warrior"]], // TODO: Slett "warrior"
        // Millenium
        ["aurora", ["sirius"]],
        ["omega-big-bead", ["omega"]],
        ["omega-4", ["sirius", "luna", "omega"]],
        // Northstar
        ["launcher-us", ["launcher"]],
        ["launcher-os", ["launcher"]],
        ["paladin-os", ["paladin"]],
        // edge cases
        ["razeri", ["raze"]],
        ["link", ["dd3"]],
        ["wizard", ["diamond"]],
        ["force", ["fl"]],
        ["stratus", ["rat"]],
        ["p2", ["spider"]],
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
          "td",
          "dd",
          "x3",
          "it",
          "fl",
          "tl",
          "xl",
          "hu",
          "fu",
          "ra",
          "fd",
          "d1",
          "d2",
          "d3",
          "f2",
          "md",
          "pd",

          "ion",
          "sol",
          "cro",
          "rat",
          "ape",
          "roc",
          "jun",
          "phi",
          "amp",
          "dae",

          "stal",
          "king",
          "halo",
          "lion",
          "nova",
          "jarn",
          "reko",
          "zion",
          "riot",
          "echo",
          "stud",

          // "force",
          // "dragon",
          "eagle",
          "world",
          "spark",
          "wings",
          "ultra",
          "glide",
          "alien",

          "marvel",
          "shield",
          // "aurora",
          "wizard",
          "scorch",
          "cosmic",
          "viking",
          "nebula",
          "raptor",

          "diamond",
          "pursuit",

          "spectrum",

          "astronaut",
        ];

        for (const item of result) {
          if (knownShortnames.includes(item)) {
            result = result.filter((s) => s !== item);
          }

          if (result.length === 1) {
            break;
          }
        }
      }

      span.end();
      return result;
    }
  );
}

function exactWordRules(productName: string, suggestions: string[]): string[] {
  return tracer.startActiveSpan("exactWordRules", (span: Span) => {
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

    span.end();
    return result;
  });
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
  return tracer.startActiveSpan("getProductDiscSuggestions", (span: Span) => {
    span.setAttribute("product.name", productName);

    let name = toLowerCase(productName);
    name = applyReplaceRule(name);
    name = removeBlacklistedWords(name);

    span.setAttribute("product.name.cleaned", name);

    let suggestions = getMatchingSlugs(name, discSlugs);
    span.setAttribute("suggestor.getMatchingSlugs", suggestions);
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
    span.setAttribute("suggestor.exactWordRules", suggestions);

    if (suggestions.length > 1) {
      suggestions = performMultipleSuggestionsRules(suggestions);
      span.setAttribute(
        "suggestor.performMultipleSuggestionsRules",
        suggestions
      );
    }

    if (suggestions.length > 1) {
      suggestions = performSpecialMutiSuggestionsRules(suggestions);
      span.setAttribute(
        "suggestor.performSpecialMutiSuggestionsRules",
        suggestions
      );
    }

    if (suggestions.length === 0) {
      suggestions = noMatchesRules(name, discSlugs);
      span.setAttribute("suggestor.noMatchesRules", suggestions);
    }

    if (suggestions.length === 1) {
      const [suggestion] = suggestions;
      const exceptions = ["ra", "fl"];
      if (exceptions.includes(suggestion)) {
        const words = name.split(" ");
        if (!words.some((word) => word === suggestion)) {
          suggestions = [];
        }
      }
    }

    span.setAttribute("suggestor.finalSuggestions", suggestions);

    span.end();
    return suggestions;
  });
}
