
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { StatsOverview } from "@/features/statistics/components/StatsOverview";
import { BooksChart } from "@/features/statistics/components/BooksChart";
import { UsersChart } from "@/features/statistics/components/UsersChart";
import { RecentActivity } from "@/features/statistics/components/RecentActivity";

const Estadisticas = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-biblioteca-blue">
            Estadísticas de la Biblioteca
          </h1>
          <div className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>

        {/* Overview Cards */}
        <StatsOverview />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BooksChart />
          <UsersChart />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default Estadisticas;
