import { Alarms } from "../components/pharmProduction/Alarms.jsx";
import { Footer } from "../components/pharmProduction/Footer.jsx";
import { Layout } from "../components/pharmProduction/Layout.jsx";
import { Parameters } from "../components/pharmProduction/Parameters.jsx";
import { ProductionStatus } from "../components/pharmProduction/ProductionStatus.jsx";
import { Status } from "../components/pharmProduction/Status.jsx";

export function Production() {
  return (
    <main className="grid grid-cols-4 grid-rows-4 gap-4 h-screen">
      {/* Layout ocupa duas colunas e três linhas */}
      <div className="col-span-2 row-span-3 bg-black">
        <Layout />
      </div>
      {/* Production Status */}
      <div className="col-span-2 bg-red-500">
        <ProductionStatus />
      </div>
      {/* Alarms */}
      <div className="col-span-2 bg-blue-500">
        <Alarms />
      </div>
      {/* Parameters */}
      <div className="col-span-2 bg-yellow-500">
        <Parameters />
      </div>
      {/* Footer ocupa toda a última linha */}
      <div className="col-span-2 bg-orange-500 h-1/2">
        <Footer />
      </div>
      {/* Status */}
      <div className="col-span-2 bg-green-500 h-1/2">
        <Status />
      </div>
    </main>
  );
}
