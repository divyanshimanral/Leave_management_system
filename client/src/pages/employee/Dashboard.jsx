import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await API.get("/leave/my/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Total</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Approved</p>
          <h2 className="text-2xl font-bold text-green-500">
            {stats.approved}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-500">
            {stats.pending}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Rejected</p>
          <h2 className="text-2xl font-bold text-red-500">{stats.rejected}</h2>
        </CardContent>
      </Card>
    </div>
  );
}
