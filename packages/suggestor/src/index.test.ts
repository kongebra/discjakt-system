import discSlugs from "./disc-slugs";
import { getProductDiscSuggestions } from "./index";
import TEST_DATA from "./test-data";

type TestData = [string, string[], string];

describe("getProductDiscSuggestions", () => {
  test.each(TEST_DATA as TestData[])(
    "given product name %s, returns %p (%s)",
    (productName, expectedSuggestions, id) => {
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
