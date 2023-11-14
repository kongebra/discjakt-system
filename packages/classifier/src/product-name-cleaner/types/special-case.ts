// src/product-name-cleaner/types/special-case.ts

export type MatchCondition = "word" | "start" | "end";
export type FollowCondition =
  | "capital"
  | "lowercase"
  | "number"
  | "specialChar";

export type SpecialCase = {
  match: string;
  boundary?: MatchCondition;
  followedBy?: FollowCondition; // Condition for what follows the match
  precededBy?: FollowCondition; // Condition for what precedes the match
  notFollowedBy?: string; // Specific characters or words that should not follow the match
  replaceWith?: string; // What to replace the match with, if not just removing it
  customReplaceFunction?: (match: string) => string; // Custom function for complex replacements
};
