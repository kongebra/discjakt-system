import { escapeRegExp } from "../../../src/product-name-cleaner/utils/regex";

describe("RegExp Escaper", () => {
  const testCases: [string, string][] = [
    // [input, expectedOutput]
    ["test-string", "test\\-string"], // Testing hyphen
    ["(test)", "\\(test\\)"], // Testing parentheses
    ["[test]", "\\[test\\]"], // Testing square brackets
    ["{test}", "\\{test\\}"], // Testing curly brackets
    ["*test*", "\\*test\\*"], // Testing asterisk
    ["+test+", "\\+test\\+"], // Testing plus
    ["?test?", "\\?test\\?"], // Testing question mark
    [".test.", "\\.test\\."], // Testing period
    ["^test$", "\\^test\\$"], // Testing caret and dollar sign
    ["|test|", "\\|test\\|"], // Testing pipe
    ["\\test\\", "\\\\test\\\\"], // Testing backslash
    // Add more test cases for other special characters and combinations
  ];

  test.each(testCases)(
    "escapeRegExp(%s) should return %s",
    (input, expected) => {
      const actual = escapeRegExp(input);
      expect(actual).toBe(expected);
    }
  );
});
