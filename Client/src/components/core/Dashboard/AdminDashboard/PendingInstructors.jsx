import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  FaEnvelope,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

import {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
} from "../../../../services/operations/adminAPI";

const PendingInstructors = () => {

  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {

    setLoading(true);

    const data = await getPendingInstructors(token);

    if (data) {
      setInstructors(data);
    }

    setLoading(false);

  };

  const handleApprove = async (id) => {
  const res = await approveInstructor(token, id);

  if (res) {
    setInstructors((prev) =>
      prev.filter((item) => item._id !== id)
    );
  }
};

  const handleReject = async (id) => {
  const res = await rejectInstructor(token, id);

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
Pending Instructors
</h1>

<p className="mt-2 text-richblack-300">
Total Pending :
<span className="ml-2 font-semibold text-yellow-50">
{instructors.length}
</span>
</p>

</div>

{
loading ?

<div className="text-center text-richblack-300 py-20">
Loading...
</div>

:

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

{

instructors.map((user)=>(

<div
  key={user._id}
  className="rounded-xl border border-richblack-700 bg-richblack-900 p-6 hover:border-yellow-50 duration-300 flex flex-col"
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

Joined :

{new Date(user.createdAt).toLocaleDateString()}

</span>

</div>

</div>

<div className="mt-8 flex items-center justify-between border-t border-richblack-700 pt-5">

<button
  onClick={() => handleApprove(user._id)}
  className="rounded-lg bg-caribbeangreen-200 px-5 py-2 font-semibold text-richblack-900 transition hover:scale-105"
>
  Approve
</button>

<button
  onClick={() => handleReject(user._id)}
  className="rounded-lg bg-pink-200 px-5 py-2 font-semibold text-richblack-900 transition hover:scale-105"
>
  Reject
</button>

</div>

</div>

))

}

</div>

}

</div>

)};

export default PendingInstructors;