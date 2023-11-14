import { cleanProductName } from "../../src";

describe("Product Name Cleaner", () => {
  const testData: [string, string][] = [
    // 1 - passed
    ["VIP War Horse - WeAreDiscGolf.no", "war horse"],
    ["Opto Stiletto - Krokhol Disc Golf Shop", "stiletto"],
    ["Dragon Line Shu", "shu"],
    ["Big Z Athena Paul McBeth", "athena"],
    ["Classic Burst Warden Blend - WeAreDiscGolf.no", "warden"],
    ["S-Line Swirly FD - WeAreDiscGolf.no", "fd"],
    ["Undertaker", "undertaker"],
    ["F3 500 - Ring of Stars Stamp", "f3"],
    ["Innova First Run Star Alien", "star alien"],
    ["Ethos Synapse", "synapse"],
    ["Cosmic Neutron Entropy - Krokhol Disc Golf Shop", "entropy"],
    ["K1 Grym", "grym"],
    ["Opto Flow - WeAreDiscGolf.no", "flow"],
    ["K1 Vass", "vass"],
    ["S-Line DD - DiscShopen.no", "dd"],
    ["Wizard Super Soft - WeAreDiscGolf.no", "wizard"],

    // 2 - passed
    ["ESP Nuke Solid White Bottom Stamp - WeAreDiscGolf.no", "nuke"],
    ["Axiom Electron Proxy Soft - Aceshop", "proxy"],
    ["Grand Trust", "trust"],
    ["Neo Essence Primal Run - WeAreDiscGolf.no", "essence"],
    ["Opto Air Explorer - WeAreDiscGolf.no", "explorer"],
    ["C-Line Color Glow FD2 Royal Rage - WeAreDiscGolf.no", "fd2"],
    ["Ground Warrior - WeAreDiscGolf.no", "ground warrior"],
    ["Special Blend S-Line CD1 Zeta's Moon - Colten Montgomery Signatu", "cd1"],
    ["Star Wraith Bottom Stamp", "star wraith"],
    ["Storm Cosmos - WeAreDiscGolf.no", "storm cosmos"],
    ["Halo Star Invader", "halo star invader"],
    ["BioFuzion Justice - Krokhol Disc Golf Shop", "justice"],
    ["Big Z Zeus Paul McBeth", "zeus"],
    ["H7", "h7"],
    ["300 Plastic M3 - Krokhol Disc Golf Shop", "m3"],
    ["Blizzard Champion Ape", "blizzard ape"],

    // 3 - passed
    ["Plasma Octane", "octane"],
    ["Nebula Ethereal Omen", "omen"],
    ["Muse [Nerve] | Spinnvill", "muse"],
    ["Alpha Texas Ranger", "alpha texas ranger"],
    ["VIP Queen - WeAreDiscGolf.no", "queen"],
    ["Bravo Guadalupe", "guadalupe"],
    [
      "Electron Envy - James Conrad Team Signature Series - Krokhol Disc Golf Shop",
      "envy",
    ],
    ["Halo Star AviarX3 - WeAreDiscGolf.no", "halo star aviarx3"],
    ["Airborn Stryder 400 - Proto Stamp", "stryder"],
    ["Classic Judge Soft - WeAreDiscGolf.no", "judge"],
    ["Z Nuke Blue Bomber Aaron Gossage", "nuke"],
    ["Lucid Air Trespass", "trespass"],
    ["Snoopy Stock Stamp/First Run Butikk", "snoopy"],
    ["ESP Anax, Paul Mcbeth", "anax"],
    ["S-Line P1 - WeAreDiscGolf.no", "p1"],
    ["Proton Inertia", "inertia"],

    // 4 - passed
    ["Neutron Switch - WeAreDiscGolf.no", "switch"],
    ["Opto Jade - DiscShopen.no", "jade"],
    ["Pro Boss", "pro boss"],
    ["CRAVE Fission - Frisbeesor.no", "crave"],
    ["Star Beast - WeAreDiscGolf.no", "star beast"],
    ["Z LINE FLY DYE ZONE - Frisbeesor.no", "zone"],
    ["Cosmic Piwakawaka - WeAreDiscGolf.no", "cosmic piwakawaka"],
    ["Star Cro - WeAreDiscGolf.no", "star cro"],
    ["DX Sonic", "sonic"],
    ["Opto Pioneer", "pioneer"],
    ["XT Stud - WeAreDiscGolf.no", "stud"],
    ["F1 500 Spectrum Plastic - Ezra Robinson 2023", "f1"],
    ["Protege Clutch - WeAreDiscGolf.no", "clutch"],
    ["DX Aviar PT & AP - Krokhol Disc Golf Shop", "aviar"],
    ["400 F1 - WeAreDiscGolf.no", "f1"],
    ["OG Firm Phi - WeAreDiscGolf.no", "phi"],
  ];

  test.each(testData)(
    "cleanProductName(%s) should return %s",
    (input, expected) => {
      const actual = cleanProductName(input);

      expect(actual).toBe(expected);
    }
  );
});
