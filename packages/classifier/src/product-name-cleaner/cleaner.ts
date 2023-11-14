import { blacklist } from "./constants/blacklist";
import { specialCharacters } from "./constants/blacklist/special-characters";
import { specialCases } from "./constants/special-cases";
import { escapeRegExp } from "./utils/regex";
import { buildSpecialCasesRegex } from "./utils/special-case";

export function cleanProductName(input: string): string {
  let output = input.toLowerCase();

  const blacklistRegex = new RegExp(
    [...blacklist.map(escapeRegExp)].join("|"),
    "gi"
  );

  output = output.replace(blacklistRegex, "");

  const specialCharactersRegex = new RegExp(
    specialCharacters.map(escapeRegExp).join("|"),
    "g"
  );

  output = output.replace(specialCharactersRegex, "");

  const specialCasesRegex = buildSpecialCasesRegex(specialCases);

  specialCasesRegex.forEach((caseItem) => {
    const { pattern, replaceWith, customReplaceFunction } = caseItem;

    if (customReplaceFunction) {
      output = output.replace(pattern, customReplaceFunction);
    } else if (replaceWith) {
      output = output.replace(pattern, replaceWith);
    } else {
      output = output.replace(pattern, "");
    }
  });

  output = output.replace(/\s{2,}/g, " ").trim(); // Replace multiple spaces with a single space

  return output;
}
