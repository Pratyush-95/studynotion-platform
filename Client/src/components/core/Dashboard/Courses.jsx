import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllCourses } from "../../../services/operations/courseDetailsAPI"

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await getAllCourses()
        if (mounted) setCourses(data || [])
      } catch (err) {
        console.error("Error fetching courses", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-6">Courses</h1>

      <div className="grid gap-6">
        {courses.length === 0 ? (
          <div className="rounded-md bg-richblack-800 p-6 text-richblack-300">No courses available.</div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="rounded-md bg-richblack-800 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-richblack-5">{course.courseName || course.title}</h3>
                <p className="text-sm text-richblack-300">Rs. {course.price || "—"}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/courses/${course._id}`} className="rounded-md bg-yellow-300 px-3 py-1 text-richblack-900 font-medium">
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
