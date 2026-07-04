import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const courseData = await getFullDetailsOfCourse(courseId, token)
        console.log("Full Course Data:", courseData)
        console.log("Course Content:", courseData?.courseDetails?.courseContent)
        
        if (courseData?.courseDetails) {
          const sections = courseData.courseDetails.courseContent || []
          sections.forEach((section, idx) => {
            console.log(`Section ${idx} - ${section.sectionName}:`, section.subSection)
            section.subSection?.forEach((sub, subIdx) => {
              console.log(`  Video ${subIdx} - ${sub.title}: videoUrl = ${sub.videoUrl ? 'EXISTS' : 'EMPTY/NULL'}`)
            })
          })
          
          dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
          dispatch(setEntireCourseData(courseData.courseDetails))
          dispatch(setCompletedLectures(courseData.completedVideos || []))
          let lectures = 0
          courseData?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length
          })
          dispatch(setTotalNoOfLectures(lectures))
        }
      } catch (error) {
        console.error("Error loading course:", error)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
            <div className="mx-6">
              <Outlet />
            </div>
          </div>
        </div>
      )}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}