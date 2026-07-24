import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaUserGraduate,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

import { getStudents } from "../../../../services/operations/adminAPI";

const StudentProfile = () => {

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  useEffect(() => {
      fetchStudents();
  }, []);

  const fetchStudents = async () => {

    setLoading(true);

   const data = await getStudents(token);

    if (data) {
      setStudents(data);;
    }

    setLoading(false);

  };

  return (

<div className="space-y-6">

<div className="rounded-xl border border-richblack-700 bg-richblack-900 p-8">

<h1 className="text-3xl font-bold text-yellow-50">
Students
</h1>

<p className="mt-2 text-richblack-300">
Total Students  :
<span className="ml-2 font-semibold text-caribbeangreen-200">
{students.length}
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

students.map((user) => (

<div
key={user._id}
className="rounded-xl border border-richblack-700 bg-richblack-900 p-6 hover:border-yellow-50 duration-300"
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

<FaUserGraduate />

<span>Student</span>

</div>

<div className="flex items-center gap-3 text-richblack-300">

<FaCalendarAlt />

<span>

Joined :

{new Date(user.createdAt).toLocaleDateString()}

</span>

</div>

</div>

<div className="mt-6 flex items-center justify-between">

<div className="rounded-full bg-caribbeangreen-900 px-4 py-2 text-caribbeangreen-200">
    Student

</div>

<button
   onClick={() =>
   navigate(`/dashboard/user-management/student/${user._id}`)
  }
className="rounded-lg bg-yellow-50 px-4 py-2 text-richblack-900 font-semibold hover:scale-105 duration-200"

>

View Profile

</button>

</div>

</div>

))

}

</div>

}

</div>

)};

export default StudentProfile;
