import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  FaEnvelope,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

import {
  getRejectedInstructors,
  approveInstructor,
} from "../../../../services/operations/adminAPI";

const RejectedInstructors = () => {

  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {

    setLoading(true);

    const data = await getRejectedInstructors(token);

    if (data) {
      setInstructors(data);
    }

    setLoading(false);

  };

  const handleApproveAgain = async (id) => {
  const res = await approveInstructor(token, id);

  if (res) {
    setInstructors((prev) =>
      prev.filter((item) => item._id !== id)
    );
  }
};

  return (

<div className="space-y-6">

<div className="rounded-xl border border-richblack-700 bg-richblack-900 p-8">

<h1 className="text-3xl font-bold text-yellow-50">
Rejected Instructors
</h1>

<p className="mt-2 text-richblack-300">
Total Rejected :
<span className="ml-2 font-semibold text-pink-400">
{instructors.length}
</span>
</p>

</div>

{
loading ?

<div className="py-20 text-center text-richblack-300">
Loading...
</div>

:

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

{

instructors.map((user)=>(

<div
key={user._id}
className="rounded-xl border border-richblack-700 bg-richblack-900 p-6 transition duration-300 hover:border-pink-400"
>

<div className="flex items-center gap-4">

<img
src={user.image}
alt=""
className="h-16 w-16 rounded-full object-cover"
/>

<div>

<h2 className="text-lg font-semibold text-richblack-5">
{user.firstName} {user.lastName}
</h2>

<p className="text-richblack-300">
{user.email}
</p>

</div>

</div>

<div className="mt-6 space-y-3">

<div className="flex items-center gap-3 text-richblack-300">
<FaEnvelope />
<span>{user.email}</span>
</div>

<div className="flex items-center gap-3 text-richblack-300">
<FaGraduationCap />
<span>Instructor</span>
</div>

<div className="flex items-center gap-3 text-richblack-300">
<FaCalendarAlt />
<span>
Joined : {new Date(user.createdAt).toLocaleDateString()}
</span>
</div>

</div>

<div className="mt-6 flex items-center justify-between border-t border-richblack-700 pt-5">

  <span className="rounded-full bg-pink-900 px-4 py-2 text-pink-200">
    Rejected
  </span>

  <div className="flex gap-3">

    <button
      onClick={() => handleApproveAgain(user._id)}
      className="rounded-lg bg-caribbeangreen-200 px-4 py-2 font-semibold text-richblack-900 transition hover:scale-105"
    >
      Approve Again
    </button>

    <button
      className="rounded-lg bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition hover:scale-105"
    >
      View Profile
    </button>

  </div>

</div>

</div>

))

}

</div>

}

</div>

)

};
export default RejectedInstructors;
