import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { useLocation } from "react-router-dom"
import ReactPlayer from "react-player"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminPreview =
  new URLSearchParams(location.search).get("adminPreview") === "true";
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playerError, setPlayerError] = useState(false)

  const formatVideoDuration = (durationInSeconds) => {
    const seconds = Math.floor(parseFloat(durationInSeconds) || 0)
    if (seconds <= 0) return ""

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) {
        console.log("No course section data yet")
        return
      }
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const selectedSection = courseSectionData.find(
          (course) => course._id === sectionId
        )
        const selectedSubSection = selectedSection?.subSection?.find(
          (data) => data._id === subSectionId
        )
        console.log("Selected SubSection:", selectedSubSection)
        setVideoData(selectedSubSection || null)
        setPreviewSource(courseEntireData?.thumbnail || "")
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
     navigate(
 `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}${
   isAdminPreview ? "?adminPreview=true" : ""
 }`
)
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
 `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}${
   isAdminPreview ? "?adminPreview=true" : ""
 }`
)
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
     navigate(
 `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}${
   isAdminPreview ? "?adminPreview=true" : ""
 }`
)
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
 `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}${
   isAdminPreview ? "?adminPreview=true" : ""
 }`
)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const resolvedVideoUrl =
    (typeof videoData?.videoUrl === 'string' ? videoData.videoUrl : null) ||
    videoData?.videoUrl?.secure_url ||
    videoData?.videoUrl?.url ||
    (typeof videoData?.video === 'string' ? videoData.video : null) ||
    videoData?.video?.secure_url ||
    videoData?.video?.url ||
    videoData?.url ||
    null

  // If Cloudinary URL doesn't include file extension, try a format fallback for better browser compatibility
  const resolvedVideoUrlWithFormat = (() => {
    if (!resolvedVideoUrl) return null
    const url = String(resolvedVideoUrl)
    if (/\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(url)) return url
    // prefer adding format query for Cloudinary when a query exists, otherwise append .mp4
    return url.includes("?") ? url + "&format=mp4" : url + ".mp4"
  })()

  const proxyVideoUrl = resolvedVideoUrl
    ? `http://localhost:5000/api/v1/course/streamSubSectionVideo?subSectionId=${subSectionId}`
    : null

  const playerSrc = proxyVideoUrl || resolvedVideoUrlWithFormat || resolvedVideoUrl

  const videoDataKeys = videoData ? Object.keys(videoData).join(", ") : ""
  const shouldShowPreview = !videoData || !resolvedVideoUrl

  console.log("VideoDetails - videoData:", videoData)
  console.log("VideoDetails - resolvedVideoUrl:", resolvedVideoUrl)
  console.log("VideoDetails - shouldShowPreview:", shouldShowPreview)

  return (
    <div className="flex flex-col gap-5 text-white">
      {shouldShowPreview ? (
        <>
          {previewSource ? (
            <img
              src={previewSource}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-md border border-dashed border-richblack-500 bg-richblack-700 text-sm text-richblack-200">
              No preview available yet.
            </div>
          )}
          {videoData ? (
            <>
              <p className="mt-2 text-sm text-red-400">🚨 VIDEO NOT AVAILABLE</p>
              <div className="mt-2 rounded-md border border-red-400 bg-red-950/20 p-4 text-xs text-red-100">
                <p className="font-bold mb-2">❌ Video Upload Issue</p>
                <p className="mb-2"><strong>Title:</strong> {videoData?.title || 'N/A'}</p>
                <p className="mb-2"><strong>Duration:</strong> {videoData?.timeDuration || 'Not set'}</p>
                <p className="mb-2"><strong>Description:</strong> {videoData?.description || 'N/A'}</p>
                <p className="mb-2 font-mono text-[10px] break-all">
                  <strong>videoUrl:</strong> {videoData?.videoUrl || '❌ EMPTY/NOT UPLOADED'}
                </p>
                <div className="mt-3 p-2 bg-red-900 rounded text-[11px]">
                  <p className="font-semibold">What's wrong?</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Video file was not uploaded by instructor</li>
                    <li>Upload to Cloudinary failed</li>
                    <li>Database entry is corrupted</li>
                  </ul>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer font-semibold">📋 Full Data</summary>
                  <pre className="mt-2 bg-richblack-900 p-2 rounded overflow-auto max-h-40 text-[9px]">
                    {JSON.stringify(videoData, null, 2)}
                  </pre>
                </details>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-yellow-400">Loading video data...</p>
          )}
        </>
      ) : (
        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
          {resolvedVideoUrl ? (
            <div className="absolute inset-0 w-full h-full">
              {/* Debug banner: show resolved URL and player state */}
              {/* <div className="absolute left-2 top-2 z-50 rounded bg-black/60 px-3 py-1 text-xs text-white">
                <div>URL: {String(resolvedVideoUrl).slice(0, 80)}{String(resolvedVideoUrl).length>80?"...":""}</div>
                <div>Status: {!playerError ? "ReactPlayer" : "Fallback (native)"}</div>
              </div> */}
              {!playerError ? (
                <ReactPlayer
                  ref={playerRef}
                  src={String(playerSrc)}
                  controls
                  width="100%"
                  height="100%"
                  onEnded={async () => {
                    setVideoEnded(true)
                    if( !isAdminPreview && !completedLectures.includes(subSectionId)){
                      const res=await markLectureAsComplete(
                        { courseId: courseId, subsectionId: subSectionId },
                        token
                      )
                    
                      if(res){
                        dispatch(updateCompletedLectures(subSectionId))
                      }
                    }
                  }}
                  onError={(e) => {
                    console.error('ReactPlayer error:', e)
                    setPlayerError(true)
                  }}
                  // Load the real player immediately so the video and controls are visible
                  light={false}
                  playing={false}
                  onReady={() => console.log('ReactPlayer ready:', resolvedVideoUrlWithFormat || resolvedVideoUrl)}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: 'anonymous',
                        preload: 'metadata',
                      },
                    },
                  }}
                />
              ) : (
                // Fallback to native video element when ReactPlayer fails
                <video
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  src={String(resolvedVideoUrlWithFormat || resolvedVideoUrl)}
                  crossOrigin="anonymous"
                  preload="metadata"
                  onError={(e) => console.error('HTML5 video error:', e)}
                >
                  <source src={String(resolvedVideoUrlWithFormat || resolvedVideoUrl)} />
                </video>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex h-full items-center justify-center bg-richblack-700">
              <div className="text-center text-richblack-200">
                <p className="mb-2">Video not available</p>
                <details className="text-xs text-richblack-400 mt-4">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <pre className="text-left mt-2 bg-richblack-800 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(videoData, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!isAdminPreview && !completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onClick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    try {
                      // ReactPlayer exposes seekTo; if the ref is a native video element, set currentTime
                      if (typeof playerRef.current.seekTo === 'function') {
                        playerRef.current.seekTo(0)
                      } else if (playerRef.current && playerRef.current.currentTime !== undefined) {
                        playerRef.current.currentTime = 0
                      }
                    } catch (e) {
                      // some players may not support seek
                      console.warn('Seek failed', e)
                    }
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      {videoData?.timeDuration && (
        <p className="mt-2 text-sm text-richblack-300">
          Duration: {formatVideoDuration(videoData.timeDuration)}
        </p>
      )}
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
// video