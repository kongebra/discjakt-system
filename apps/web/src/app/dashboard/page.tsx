import Section from "@/components/section";
import { getDiscs, getProducts } from "@/lib/server";
import { Card, Grid, Metric, Text, Title } from "@tremor/react";

export const revalidate = 60;

export default async function DashboardIndex() {
  const [productsNotSet, productsDiscs, discs] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
      },
    }),
    getProducts({
      where: {
        category: {
          equals: "DISC",
        },
      },
    }),
    getDiscs(),
  ]);

  return (
    <>
      <Section>
        <Title>Dashboard</Title>
        <Text>Lorem ipsum dolor sit amet</Text>

        <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
          <Card decoration="top" decorationColor="amber">
            <Text>Products (NOT_SET)</Text>
            <Metric>{productsNotSet.length.toLocaleString()}</Metric>
          </Card>

          <Card decoration="top" decorationColor="green">
            <Text>Products (DISC)</Text>
            <Metric>{productsDiscs.length.toLocaleString()}</Metric>
          </Card>

          <Card decoration="top" decorationColor="teal">
            <Text>Discs</Text>
            <Metric>{discs.length.toLocaleString()}</Metric>
          </Card>
        </Grid>
      </Section>
    </>
  );
}
