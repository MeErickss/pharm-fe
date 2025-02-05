import { Alarms } from "../components/pharmProduction/Alarms.jsx";
import { Footer } from "../components/pharmProduction/Footer.jsx";
import { Layout } from "../components/pharmProduction/Layout.jsx";
import { ProductionStatus } from "../components/pharmProduction/ProductionStatus.jsx";
import { Status } from "../components/pharmProduction/Status.jsx";

export function Production() {
  return (
    <main className="grid grid-cols-4 grid-rows-4 gap-4 w-full h-full bg-gray-100">
      <div className="col-span-2 row-span-3 bg-black">
        <Layout />
      </div>
      <div className="col-span-2 row-span-2 bg-red-500">
        <ProductionStatus />
      </div>
      <div className="col-span-2 bg-blue-500">
        <Alarms />
      </div>
      <div className="col-span-2 bg-orange-500 h-1/2">
        <Footer />
      </div>
      <div className="col-span-2 bg-green-500 h-1/2">
        <Status />
      </div>
    </main>
  );
}
