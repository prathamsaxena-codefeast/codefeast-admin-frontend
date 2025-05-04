"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    term: "6 months",
    total: 18,
  },
  {
    term: "12 months",
    total: 45,
  },
  {
    term: "18 months",
    total: 32,
  },
  {
    term: "24 months",
    total: 27,
  },
  {
    term: "36 months",
    total: 22,
  },
  {
    term: "48 months",
    total: 12,
  },
];

export function LoanTermsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="term" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
