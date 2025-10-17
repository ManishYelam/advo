import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";

const Calendar = () => {
  const upcomingDates = [
    { case: "Case A", date: "2025-10-10" },
    { case: "Case B", date: "2025-10-15" },
  ];

  return (
    <DashboardLayout>
      {/* Container with 12px margin */}
      <div className="m-3">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Calendar</h1>
        </div>

        {/* Grid of upcoming dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingDates.map((d, idx) => (
            <Card key={idx} title={d.case}>
              <p className="text-sm text-gray-700">
                Next Court Date: <span className="font-medium">{d.date}</span>
              </p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
