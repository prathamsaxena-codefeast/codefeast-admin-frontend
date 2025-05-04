import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentLoans = [
  {
    id: "1",
    borrower: "John Doe",
    amount: "$5,000",
    term: "12 months",
    status: "Approved",
  },
  {
    id: "2",
    borrower: "Jane Smith",
    amount: "$10,000",
    term: "24 months",
    status: "Pending",
  },
  {
    id: "3",
    borrower: "Bob Johnson",
    amount: "$7,500",
    term: "18 months",
    status: "Approved",
  },
  {
    id: "4",
    borrower: "Alice Brown",
    amount: "$3,000",
    term: "6 months",
    status: "Approved",
  },
  {
    id: "5",
    borrower: "Charlie Davis",
    amount: "$15,000",
    term: "36 months",
    status: "Pending",
  },
]

export function RecentLoans() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Borrower</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Term</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentLoans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.borrower}</TableCell>
            <TableCell>{loan.amount}</TableCell>
            <TableCell>{loan.term}</TableCell>
            <TableCell className="text-right">{loan.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

