import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import { useState, useEffect } from "react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [upcomingDates, setUpcomingDates] = useState([
    { 
      case: "Case No. 123/2024", 
      date: "2025-10-10",
      time: "10:30 AM",
      court: "Session Court, Mumbai",
      status: "Hearing",
      priority: "high"
    },
    { 
      case: "Case No. 456/2024", 
      date: "2025-10-15",
      time: "2:15 PM", 
      court: "High Court, Delhi",
      status: "Arguments",
      priority: "medium"
    },
    { 
      case: "Case No. 789/2024", 
      date: "2025-10-18",
      time: "11:00 AM",
      court: "District Court, Pune",
      status: "Evidence",
      priority: "low"
    },
  ]);

  // Filter for today's cases
  const todayCases = upcomingDates.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.date === today;
  });

  // Filter for upcoming cases (next 7 days)
  const upcomingCases = upcomingDates.filter(item => {
    const caseDate = new Date(item.date);
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    return caseDate > new Date() && caseDate <= nextWeek;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Hearing': return 'bg-blue-100 text-blue-800';
      case 'Arguments': return 'bg-purple-100 text-purple-800';
      case 'Evidence': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      {/* Container with 12px margin */}
      <div className="m-3">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Court Calendar</h1>
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {upcomingDates.length} Upcoming
          </span>
        </div>

        {/* Today's Cases Section */}
        {todayCases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Today's Hearings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayCases.map((d, idx) => (
                <Card key={idx} className="border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{d.case}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(d.priority)}`}>
                      {d.priority}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span> {d.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Court:</span> {d.court}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(d.status)}`}>
                        {d.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Cases Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Hearings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingCases.map((d, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{d.case}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(d.priority)}`}>
                    {d.priority}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(d.date).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {d.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Court:</span> {d.court}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(d.status)}`}>
                      {d.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Cases Table View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Scheduled Cases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingDates.map((d, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.case}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(d.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.court}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(d.priority)}`}>
                        {d.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {upcomingDates.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Cases</h3>
            <p className="text-gray-500">You don't have any court hearings scheduled at the moment.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;