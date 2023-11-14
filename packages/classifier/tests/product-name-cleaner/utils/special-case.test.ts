import { SpecialCase } from "../../../src/product-name-cleaner/types/special-case";
import { buildSpecialCasesRegex } from "../../../src/product-name-cleaner/utils/special-case";

describe("Special Cases Regex Builder", () => {
  const specialCases: SpecialCase[] = [
    // Define various special cases
    { match: "z", boundary: "word" },
    { match: "esp", boundary: "word" },
    { match: "test", followedBy: "capital" },
    { match: "example", precededBy: "specialChar" },
    { match: "sample", notFollowedBy: "xyz" },
    // Add more special cases as needed
  ];

  const expectedPatterns = [
    // Corresponding expected regex patterns for each special case
    /\bz\b/g,
    /\besp\b/g,
    /test(?=\s+[A-Z])/g,
    /(?<=\W)example/g,
    /sample(?!xyz)/g,
    // Add more expected patterns as needed
  ];

  test.each(
    specialCases.map((caseItem, index) => [caseItem, expectedPatterns[index]])
  )(
    "buildSpecialCasesRegex for case %j should create pattern %j",
    (caseItem, expectedPattern) => {
      const actualPatterns = buildSpecialCasesRegex([caseItem]);
      expect(actualPatterns[0].pattern).toEqual(expectedPattern);
    }
  );
});
