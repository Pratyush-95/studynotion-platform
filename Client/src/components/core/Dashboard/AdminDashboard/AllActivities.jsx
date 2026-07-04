import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ActivityCard from "./ActivityCard";
import ActivityHeader from "./ActivityHeader";
import ActivityStats from "./ActivityStats";
import ActivitySearch from "./ActivitySearch";
import {
  FiBell,
  FiBook,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";
import { getRecentActivities } from "../../../../services/operations/adminAPI";


const AllActivities = () => {
  const { token } = useSelector((state) => state.auth);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchActivities = useCallback(async () => {
    if (!token) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getRecentActivities(token);
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const title = activity?.title ?? "";
      const message = activity?.message ?? "";
      const type = activity?.type ?? "";

      const matchesSearch =
        !searchTerm ||
        title.toLowerCase().includes(searchTerm) ||
        message.toLowerCase().includes(searchTerm);

      if (filter === "All") return matchesSearch;

      return matchesSearch && type.toLowerCase() === filter.toLowerCase();
    });
  }, [activities, search, filter]);

  const stats = useMemo(() => {
  return {
    notification: filteredActivities.filter(
      (a) => a.type?.toUpperCase() === "NOTIFICATION"
    ).length,

    payment: filteredActivities.filter(
      (a) => a.type?.toUpperCase() === "PAYMENT"
    ).length,

    course: filteredActivities.filter(
      (a) => a.type?.toUpperCase() === "COURSE"
    ).length,

    support: filteredActivities.filter(
      (a) => a.type?.toUpperCase() === "SUPPORT"
    ).length,
  };
}, [filteredActivities]);


  const activityCountLabel = `${filteredActivities.length} ${filteredActivities.length === 1 ? "Activity" : "Activities"} Found`;

  return (
    <div className="space-y-6">
    <ActivityHeader
    activityCount={activityCountLabel}
    />

      <ActivitySearch
      search={search}
      setSearch={setSearch}
      filter={filter}
      setFilter={setFilter}
      />


         <ActivityStats
         stats={stats}
         icons={{
          notification: <FiBell />,
          payment: <FiDollarSign />,
          course: <FiBook />,
          support: <FiMessageSquare />,
          }}
          />

      {loading ? (
        <p className="text-richblack-300">Loading...</p>
      ) : (
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="rounded-xl border border-richblack-700 bg-richblack-900 py-16 text-center text-richblack-400">
              No activities found.
            </div>
          ) : (
             filteredActivities.map((activity, index) => (
             <ActivityCard
             key={activity?._id || activity?.id || index}
             activity={activity}
            />
          ))
          )}
        </div>
      )}
    </div>
  );
};


export default AllActivities;