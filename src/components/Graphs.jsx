import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend,
  LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Graphs = ({ caseStatusData, caseTypeData, paymentsData, casesPerMonthData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Pie Chart: Case Status */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Case Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={caseStatusData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {caseStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Case Type Distribution */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Case Type Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={caseTypeData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {caseTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar + Line Chart: Cases Per Month */}
      <div className="bg-white rounded shadow p-4 col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Cases Per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={casesPerMonthData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cases" fill="#82ca9d" />
            <Line type="monotone" dataKey="cases" stroke="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Payments Over Time */}
      <div className="bg-white rounded shadow p-4 col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Payments Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={paymentsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Graphs;
