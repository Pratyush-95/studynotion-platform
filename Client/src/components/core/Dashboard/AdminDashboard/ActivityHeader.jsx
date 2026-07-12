import { FiDownload, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const ActivityHeader = ({
  activityCount,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-yellow-50">
          All Activities
        </h1>

        <p className="mt-2 text-richblack-300">
          {activityCount}
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm text-richblack-5 transition hover:border-yellow-50">
          <FiDownload />
          Export
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 hover:border-yellow-50">

  <FiCalendar className="text-richblack-300" />

  <DatePicker
    selectsRange
    startDate={startDate}
    endDate={endDate}
    onChange={(dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    }}
      maxDate={new Date()}
    dateFormat="dd MMM yyyy"
    placeholderText="Select Date Range"
    className="w-[180px] bg-transparent text-sm text-richblack-5 outline-none"
  />

</div>
      </div>
    </div>
  );
};

export default ActivityHeader;