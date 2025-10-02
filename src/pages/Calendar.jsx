import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";

const Calendar = () => {
  const upcomingDates = [
    { case: "Case A", date: "2025-10-10" },
    { case: "Case B", date: "2025-10-15" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingDates.map((d, idx) => (
          <Card key={idx} title={d.case}>
            <p>Next Court Date: {d.date}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
