// src/index.test.ts

import { getProductDiscSuggestions } from "./index";

const discSlugs = [
  "anax",
  "archangel",
  "avenger-ss",
  "aviar",
  "aviar3",
  "ballista",
  "ballista-pro",
  "beast",
  "berg",
  "boss",
  "buzzz",
  "buzzz-os",
  "buzzz-ss",
  "claymore",
  "compass",
  "crank",
  "crown",
  "dart",
  "dd3",
  "deputy",
  "destroyer",
  "diamond",
  "dragon",
  "eagle",
  "enigma",
  "explorer",
  "falk",
  "felon",
  "fierce",
  "firebird",
  "fuse",
  "gatekeeper",
  "gator",
  "gote",
  "grym",
  "grym-x",
  "harp",
  "hydra",
  "instinct",
  "jade",
  "judge",
  "justice",
  "katana",
  "kaxe",
  "kaxe-z",
  "leopard",
  "leopard3",
  "link",
  "lots",
  "luna",
  "maestro",
  "maiden",
  "mako3",
  "malta",
  "mentor",
  "method",
  "nova",
  "nuke",
  "orc",
  "pd",
  "pig",
  "pure",
  "raptor",
  "rask",
  "reko",
  "rhyno",
  "roach",
  "roadrunner",
  "roc3",
  "rocx3",
  "sapphire",
  "sensei",
  "shield",
  "shryke",
  "sidewinder",
  "sol",
  "stal",
  "tactic",
  "teebird",
  "teebird3",
  "thrasher",
  "thunderbird",
  "tl",
  "tl3",
  "trespass",
  "undertaker",
  "valkyrie",
  "wraith",
  "xcaliber",
  "zeus",
  "zone",
];

const tests: [string, string[]][] = [
  ["Evolution Neo Method - Aceshop", ["method"]],
  ["Discmania Evolution Exo Link Hard - Aceshop", ["link"]],
  ["ESP Malta Midrange - Aceshop", ["malta"]],
  ["Evolution Neo Method - Aceshop", ["method"]],
  ["Evolution Neo Instinct - Aceshop", ["instinct"]],
  ["Evolution Neo Enigma - Aceshop", ["enigma"]],
  ["Big Z Buzzz - Aceshop", ["buzzz"]],
  ["BIG Z undertaker - Aceshop", ["undertaker"]],
  ["Active Premium Maestro - Aceshop", ["maestro"]],
  ["Active Premium Mentor - Aceshop", ["mentor"]],
  ["Active Premium Sensei - Aceshop", ["sensei"]],
  ["Discmania Evolution Exo Tactic Hard - Aceshop", ["tactic"]],
  ["Jawbreaker Luna Paul McBeth - Aceshop", ["luna"]],
  ["Jawbreaker Roach - Aceshop", ["roach"]],
  ["Jawbreaker Zone - Aceshop", ["zone"]],
  ["5X Paige Pierce ESP Nuke - Aceshop", ["nuke"]],
  ["ESP Anax Paul McBeth - Aceshop", ["anax"]],
  ["ESP AVENGER SS PAUL MCBETH SIGNATURE SERIES - Aceshop", ["avenger-ss"]],
  ["ESP BUZZZ PAUL MCBETH SIGNATURE SERIES - Aceshop", ["buzzz"]],
  ["ESP BUZZZ SS - Aceshop", ["buzzz-ss"]],
  ["PAUL MCBETH ZEUS DRIVER - Aceshop", ["zeus"]],
  ["ESP ZONE 6x Paul McBeth Signature Series - Aceshop", ["zone"]],
  ["ESP Raptor - Aceshop", ["raptor"]],
  ["TITANIUM BUZZZ - Aceshop", ["buzzz"]],
  ["TITANIUM ZONE - Aceshop", ["zone"]],
  ["5X PAIGE PIERCE Z SOL - Aceshop", ["sol"]],
  ["5X PAIGE PIERCE Z UNDERTAKER - Aceshop", ["undertaker"]],
  ["Z LINE AVENGER SS - Aceshop", ["avenger-ss"]],
  ["Z-Line Buzzz - Aceshop", ["buzzz"]],
  ["Z-Line Buzzz OS - Aceshop", ["buzzz-os"]],
  ["Z LINE CRANK - Aceshop", ["crank"]],
  ["Z-Line Buzzz SS - Aceshop", ["buzzz-ss"]],
  ["Z-Line Fly Dye Buzzz - Aceshop", ["buzzz"]],
  ["K1 GØTE - Aceshop", ["gote"]],
  ["K1 Stål - Aceshop", ["stal"]],
  ["K3 Kaxe Z - Aceshop", ["kaxe-z"]],
  ["Paige Pierce Fierce - Aceshop", ["fierce"]],
  ["Gold Ballista Pro - Aceshop", ["ballista-pro"]],
  ["Gold Ballista - Aceshop", ["ballista"]],
  ["Gold Claymore - Aceshop", ["claymore"]],
  ["Gold Compass - Aceshop", ["compass"]],
  ["Lucid Trespass - Aceshop", ["trespass"]],
];

describe("getProductDiscSuggestions", () => {
  test.each(tests)(
    "given product name %s, returns %p",
    (productName, expectedSuggestions) => {
      // we need to check if we are missing our expected suggestions in our discSlugs
      // if we are, throw an error (we need to make it and add it to our discSlugs)
      if (expectedSuggestions.some((s) => !discSlugs.includes(s))) {
        throw new Error(
          `Missing expected suggestion in discSlugs: ${expectedSuggestions}`
        );
      }

      const suggestions = getProductDiscSuggestions(productName, discSlugs);
      expect(suggestions).toEqual(expectedSuggestions);
    }
  );
});
