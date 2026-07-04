import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDashboardStats ,getRecentActivities} from "../../../../services/operations/adminAPI";
import { Link } from "react-router-dom";
import RecentActivities from "./RecentActivities";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRupeeSign,
  FaClock,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);



const quickActions = [
  {
    title: "Pending Instructors",
    link: "/dashboard/pending-instructors",
  },
  {
    title: "Approved Instructors",
    link: "/dashboard/approved-instructors",
  },
  {
    title: "Rejected Instructors",
    link: "/dashboard/rejected-instructors",
  },
  {
    title: "User Management",
    link: "/dashboard/user-management",
  },
];

const AdminPage = () => {

const { token } = useSelector((state) => state.auth);

const [stats, setStats] = useState(null);
const [activities, setActivities] = useState([]);

useEffect(() => {
  fetchDashboardStats();
  fetchRecentActivities();
}, []);

const fetchDashboardStats = async () => {
  const data = await getDashboardStats(token);
  console.log("Dashboard Data:", data);

  if (data) {
    setStats(data);
  }
};

 const fetchRecentActivities = async () => {
    const data = await getRecentActivities(token);

     console.log("Recent Activities Data:", data);

    if (data) {
      setActivities(data);
    }
  };

const cards = [
  {
    title: "Total Users",
    value: stats?.totalUsers || 0,
    icon: <FaUsers />,
    color: "text-blue-400",
  },
  {
    title: "Students",
    value: stats?.totalStudents || 0,
    icon: <FaUserGraduate />,
    color: "text-green-400",
  },
  {
    title: "Instructors",
    value: stats?.totalInstructors || 0,
    icon: <FaChalkboardTeacher />,
    color: "text-yellow-400",
  },
  {
    title: "Courses",
    value: stats?.totalCourses || 0,
    icon: <FaBookOpen />,
    color: "text-pink-400",
  },
  {
    title: "Revenue",
    value: `₹${stats?.totalRevenue || 0}`,
    icon: <FaRupeeSign />,
    color: "text-emerald-400",
  },
  {
    title: "Pending Requests",
    value: stats?.pendingInstructors || 0,
    icon: <FaClock />,
    color: "text-orange-400",
  },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const revenueData = new Array(12).fill(0);

stats?.monthlyRevenue?.forEach((item) => {
  revenueData[item._id - 1] = item.revenue;
});

const chartData = {
  labels: months,
  datasets: [
    {
      label: "Revenue",
      data: revenueData,
      borderColor: "#FFD60A",
      backgroundColor: "rgba(255,214,10,0.2)",
      tension: 0.4,
    },
  ],
};
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-8">

        <h1 className="text-4xl font-bold text-yellow-50">
          Welcome Back, Admin 👋
        </h1>

        <p className="mt-3 text-richblack-300">
          Monitor users, instructors, courses and platform performance from one place.
        </p>

      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {
          cards.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-richblack-700 bg-richblack-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-50"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-richblack-300">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-richblack-5">
                    {item.value}
                  </h2>

                </div>

                <div className={`text-4xl ${item.color}`}>
                  {item.icon}
                </div>

              </div>

            </div>
          ))
        }

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-6">

          <h2 className="text-xl font-semibold text-yellow-50">
            Revenue Analytics
          </h2>
           
           <div className="mt-8 h-64">
  <Line
    data={chartData}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#F8F8F8",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#F8F8F8",
          },
        },
        y: {
          ticks: {
            color: "#F8F8F8",
          },
        },
      },
    }}
  />
</div>

        </div>

        <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-6">

          <h2 className="text-xl font-semibold text-yellow-50">
            User Growth
          </h2>

          <div className="mt-8 flex h-64 items-center justify-center rounded-lg border border-dashed border-richblack-600">

            <p className="text-richblack-400">
              User Growth Chart Coming Soon
            </p>

          </div>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

  <RecentActivities activities={activities} />

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-6">

    <h2 className="text-xl font-semibold text-yellow-50">
      Platform Overview
    </h2>

    <div className="mt-6 space-y-4">

      <div className="flex justify-between">
        <span className="text-richblack-300">Pending Instructors</span>
        <span className="text-yellow-50 font-semibold">
          {stats?.pendingInstructors}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-richblack-300">Approved Instructors</span>
        <span className="text-green-400 font-semibold">
          {stats?.approvedInstructors}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-richblack-300">Rejected Instructors</span>
        <span className="text-red-400 font-semibold">
          {stats?.rejectedInstructors}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-richblack-300">Published Courses</span>
        <span className="text-green-400 font-semibold">
          {stats?.publishedCourses}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-richblack-300">Pending Courses</span>
        <span className="text-yellow-400 font-semibold">
          {stats?.pendingCourses}
        </span>
      </div>

    </div>

  </div>

</div>

      {/* Quick Actions */}

      <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-6">

        <h2 className="mb-6 text-xl font-semibold text-yellow-50">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {
            quickActions.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="rounded-xl border border-richblack-700 bg-richblack-800 p-5 text-center text-richblack-5 transition hover:border-yellow-50 hover:bg-richblack-700"
              >
                {item.title}
              </Link>
            ))
          }

        </div>

      </div>

    </div>
  );
};

export default AdminPage;