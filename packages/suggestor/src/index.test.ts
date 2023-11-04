// src/index.test.ts

import { getProductDiscSuggestions } from "./index";

const discSlugs = [
  "anax",
  "archangel",
  "avenger-ss",
  "aviar",
  "berg",
  "boss",
  "buzzz",
  "buzzz-os",
  "buzzz-ss",
  "crank",
  "dart",
  "dd3",
  "dragon",
  "enigma",
  "falk",
  "fierce",
  "gator",
  "gote",
  "grym",
  "grym-x",
  "hydra",
  "instinct",
  "kaxe",
  "kaxe-z",
  "link",
  "lots",
  "luna",
  "maestro",
  "malta",
  "mentor",
  "method",
  "nova",
  "nuke",
  "pd",
  "raptor",
  "rask",
  "reko",
  "rhyno",
  "roach",
  "roc3",
  "sensei",
  "sol",
  "stal",
  "tactic",
  "thrasher",
  "thunderbird",
  "undertaker",
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
