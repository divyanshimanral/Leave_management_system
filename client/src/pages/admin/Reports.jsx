import { useEffect, useState } from "react";
import API from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/report/trends").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Reports</h1>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="leaves" />
      </LineChart>
    </div>
  );
}
