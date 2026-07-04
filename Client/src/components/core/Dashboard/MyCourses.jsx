import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState(null)

  const getInstructorCourses = async () => {
    try {
      const result = await fetchInstructorCourses(token)
      setCourses(result)
    } catch (error) {
      console.log("Could not fetch instructor courses.")
      setCourses([])
    }
  }

  useEffect(() => {
    getInstructorCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="text-3xl text-richblack-50">My Courses</div>
      {!courses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !courses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not created any courses yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          <CoursesTable courses={courses} setCourses={setCourses} />
        </div>
      )}
    </>
  )
}
