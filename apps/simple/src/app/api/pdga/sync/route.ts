import { parseCSV, parsePDGAApproveDate, slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

const url =
  "https://www.pdga.com/technical-standards/equipment-certification/discs/export";

type PDGADiscsExportCSVType = {
  "Manufacturer / Distributor": string;
  "Disc Model": string;
  "Max Weight (gr)": string;
  "Diameter (cm)": string;
  "Height (cm)": string;
  "Rim Depth (cm)": string;
  "Inside Rim Diameter (cm)": string;
  "Rim Thickness (cm)": string;
  "Rim Depth / Diameter Ratio (%)": string;
  "Rim Configuration": string;
  "Flexibility (kg)": string;
  Class: string;
  "Max Weight Vint (gr)": string;
  "Last Year Production": string;
  "Certification Number": string;
  "Approved Date": string;
};

type Disc = {
  manufacturer: string;
  manufacturer_slug: string;
  name: string;
  slug: string;
  max_weight: string;
  diameter: string;
  height: string;
  rim_depth: string;
  inside_rim_diameter: string;
  rim_thickness: string;
  rim_depth_diameter_ratio: string;
  rim_configuration: string;
  flexibility: string | null;
  class: string | null;
  max_weight_vint: string | null;
  last_year_production: string | null;
  certification_number: string;
  approved_date: string;
  speed: number | null;
  glide: number | null;
  turn: number | null;
  fade: number | null;
  images: string[];
};

export async function GET(req: Request) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data from PDGA");
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const array = new Uint8Array(buffer);
    const text = new TextDecoder().decode(array);
    const csvData = parseCSV(text) as PDGADiscsExportCSVType[];

    const data = csvData.map((disc) => {
      const manufacturer_slug = slugify(disc["Manufacturer / Distributor"]);
      let model_slug = slugify(disc["Disc Model"]);

      return {
        manufacturer: disc["Manufacturer / Distributor"],
        manufacturer_slug,
        name: disc["Disc Model"],
        slug: model_slug,
        max_weight: disc["Max Weight (gr)"],
        diameter: disc["Diameter (cm)"],
        height: disc["Height (cm)"],
        rim_depth: disc["Rim Depth (cm)"],
        inside_rim_diameter: disc["Inside Rim Diameter (cm)"],
        rim_thickness: disc["Rim Thickness (cm)"],
        rim_depth_diameter_ratio: disc["Rim Depth / Diameter Ratio (%)"],
        rim_configuration: disc["Rim Configuration"],
        flexibility: disc["Flexibility (kg)"] || null,
        class: disc.Class || null,
        max_weight_vint: disc["Max Weight Vint (gr)"] || null,
        last_year_production: disc["Last Year Production"] || null,
        certification_number: disc["Certification Number"],
        approved_date: parsePDGAApproveDate(disc["Approved Date"]),
        speed: null,
        glide: null,
        turn: null,
        fade: null,
        images: [],
      } satisfies Disc;
    });

    const manufacturers = new Set(data.map((disc) => disc.manufacturer_slug));
    const manufacturersDiscs = Array.from(manufacturers)
      .map((manufacturer) => {
        const discs = data
          .filter((disc) => disc.manufacturer_slug === manufacturer)
          .sort(
            (a, b) =>
              new Date(b.approved_date).getTime() -
              new Date(a.approved_date).getTime(),
          );

        return {
          manufacturer,
          count: discs.length,
          discs,
        };
      })
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(
      {
        data: manufacturersDiscs,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}

