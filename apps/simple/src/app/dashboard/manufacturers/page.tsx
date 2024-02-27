import { getManufacturers } from "./api";
import ManufacturersTable from "./manufacturers-table";

export default async function Page() {
  const data = await getManufacturers();

  return (
    <div>
      <h1 className="text-4xl font-semibold scroll-m-20 tracking-tight mb-8">
        Manufacturers
      </h1>

      <ManufacturersTable data={data} />
    </div>
  );
}

