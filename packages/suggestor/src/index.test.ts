import discSlugs from "./disc-slugs";
import { getProductDiscSuggestions } from "./index";
import { TEST_DATA } from "./test-data";

describe("getProductDiscSuggestions", () => {
  test.each(TEST_DATA)(
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
