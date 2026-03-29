import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MyLeaves() {
  const leaves = [
    { date: "10-03", status: "Approved" },
    { date: "15-03", status: "Pending" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">My Leaves</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leaves.map((l, i) => (
            <TableRow key={i}>
              <TableCell>{l.date}</TableCell>
              <TableCell>
                <Badge
                  variant={l.status === "Approved" ? "default" : "secondary"}
                >
                  {l.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
