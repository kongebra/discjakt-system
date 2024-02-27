import { parseCSV, slugify } from "@/lib/utils";
import { PDGADiscsExportCSVType } from "./types";
import { Prisma } from "@discjakt/db";

export function ensureNumber(value: string) {
  return isNaN(+value) ? 0 : +value;
}

const url =
  "https://www.pdga.com/technical-standards/equipment-certification/discs/export";

export async function fetchPdgaData() {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data from PDGA");
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const array = new Uint8Array(buffer);
  const text = new TextDecoder().decode(array);
  const csvData = parseCSV(text) as PDGADiscsExportCSVType[];

  return csvData.filter((disc) => !!disc["Disc Model"]);
}

export function mapPDGADiscToDiscCreateManyInput(disc: PDGADiscsExportCSVType) {
  const manufacturerSlug = slugify(disc["Manufacturer / Distributor"]);
  const slug = slugify(`${manufacturerSlug} ${disc["Disc Model"]}`);

  return {
    name: disc["Disc Model"],
    slug,

    manufacturerSlug,

    approvedDate: new Date(disc["Approved Date"]),
    certificationNumber: disc["Certification Number"],
    class: disc.Class || null,
    flexibility: disc["Flexibility (kg)"] ?? "",
    lastYearProduction: disc["Last Year Production"] || null,
    maxWeightVint: disc["Max Weight Vint (gr)"] || null,
    diameter: ensureNumber(disc["Diameter (cm)"]),
    height: ensureNumber(disc["Height (cm)"]),
    maxWeight: ensureNumber(disc["Max Weight (gr)"]),
    rimDepth: ensureNumber(disc["Rim Depth (cm)"]),
    rimThickness: ensureNumber(disc["Rim Thickness (cm)"]),
    insideRimDiameter: ensureNumber(disc["Inside Rim Diameter (cm)"]),
    rimDepthToDiameterRatio: ensureNumber(
      disc["Rim Depth / Diameter Ratio (%)"],
    ),
    rimConfiguration: disc["Rim Configuration"],

    speed: 0,
    glide: 0,
    turn: 0,
    fade: 0,
  } satisfies Prisma.DiscCreateManyInput;
}

export function mapPDGADiscToManufacturerCreateManyInput(
  disc: PDGADiscsExportCSVType,
) {
  return {
    name: disc["Manufacturer / Distributor"],
    slug: slugify(disc["Manufacturer / Distributor"]),
  } satisfies Prisma.ManufacturerCreateManyInput;
}

