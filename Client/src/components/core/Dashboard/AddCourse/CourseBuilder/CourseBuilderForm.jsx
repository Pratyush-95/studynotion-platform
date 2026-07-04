import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"

import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"

import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)

  const dispatch = useDispatch()

  // ✅ FIXED HANDLER
  const onSubmit = async (data) => {
    setLoading(true)

    try {
      let response

      if (editSectionName) {
        // UPDATE
        response = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course._id,
          },
          token
        )
      } else {
        // CREATE
        response = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course._id,
          },
          token
        )
      }

      console.log("API RESPONSE:", response)

      if (response) {
        // 🔥 MOST IMPORTANT FIX
        dispatch(setCourse(response))
      }

      // reset
      setEditSectionName(null)
      setValue("sectionName", "")

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }

    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  // ✅ FIXED NEXT BUTTON
  const goToNext = () => {
    console.log("COURSE:", course)
    

    if (!course?.courseContent || course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    // If some sections don't have lectures yet, warn the user
    // but allow them to proceed — they can add lectures later.
    const hasEmptyLectures = course.courseContent.some(
      (section) => !section.subSection || section.subSection.length === 0
    )

    if (hasEmptyLectures) {
      toast("Some sections have no lectures. You can add them later.")
    }

    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Course Builder
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5">
            Section Name <sup className="text-pink-200">*</sup>
          </label>

          <input
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />

          {errors.sectionName && (
            <span className="text-xs text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section" : "Create Section"}
            outline
          >
            <IoAddCircleOutline size={20} />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm underline text-richblack-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* SECTION LIST */}
      {course?.courseContent?.length > 0 && (
        <NestedView
          handleChangeEditSectionName={handleChangeEditSectionName}
        />
      )}

      {/* BUTTONS */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="rounded-md bg-richblack-300 px-5 py-2 font-semibold text-richblack-900"
        >
          Back
        </button>

        {/* ✅ IMPORTANT FIX */}
        <IconBtn disabled={loading} text="Next" onClick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}