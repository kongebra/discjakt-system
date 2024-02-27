import { getDiscs } from "./api";
import DiscsTable from "./discs-table";

export default async function Page() {
  const data = await getDiscs();

  return (
    <div>
      <h1 className="text-4xl font-semibold scroll-m-20 tracking-tight mb-8">
        Manufacturers
      </h1>

      <DiscsTable data={data} />
    </div>
  );
}

