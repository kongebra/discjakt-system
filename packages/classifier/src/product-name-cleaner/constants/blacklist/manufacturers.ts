const base: string[] = [
  "innova",
  "discmania",
  "discraft",
  "dynamic-discs",
  "dynamic discs",
  "axiom",
  "mvp",
  "divergent",
  "kastaplast",
  "yikun",
  "latitude-64",
  "latitude 64",
  "westside discs",
  "westside-discs",
  "westside",
  "prodigy",
  "prodiscus",
  "guru",
];

export const manufacturers: string[] = [
  ...base.map((manufacturer) => `fra ${manufacturer}`),
  ...base,
];
