import Section from "@/components/section";
import StatCard from "@/components/stat-card";
import Text from "@/components/text";
import Title from "@/components/title";
import { getDiscs, getManufacturers, getProducts } from "@/lib/server";
import {
  DocumentIcon,
  FingerPrintIcon,
  FireIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export const revalidate = 5;

export default async function DashboardIndex() {
  const [products, productsNotSet, discs, manufacturers] = await Promise.all([
    getProducts(),
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
      },
    }),
    getDiscs(),
    getManufacturers(),
  ]);

  return (
    <>
      <Section>
        <Title>Dashboard</Title>
        <Text className="mb-8">Lorem ipsum dolor sit amet</Text>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Products"
            value={products.length.toLocaleString()}
            icon={<TagIcon className="h-4 w-4 text-muted-foreground" />}
            description={`${productsNotSet.length.toLocaleString()} NOT_SET`}
          />
          <StatCard
            title="Discs"
            value={discs.length.toLocaleString()}
            icon={<FireIcon className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Manufacturers"
            value={manufacturers.length.toLocaleString()}
            icon={<FingerPrintIcon className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </Section>
    </>
  );
}
