const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  console.log("courseId:", courseId);
  console.log("subsectionId:", subsectionId);
  console.log("userId:", userId);

  try {
    const subsection = await SubSection.findById(subsectionId);
     console.log("subsection:", subsection);
    if (!subsection) {
      return res.status(404).json({
        error: "Invalid subsection",
      });
    }
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgress:", courseProgress);
    
    // If course progress doesn't exist, create it
    if (!courseProgress) {
      console.log("CourseProgress not found, creating new one...");
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
      console.log("Created new CourseProgress:", courseProgress);
    }
    
    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(400).json({
        error: "Subsection already completed",
      });
    }

      
  console.log("Before Push:", courseProgress.completedVideos);

      courseProgress.completedVideos.push(subsectionId);

        console.log("After Push:", courseProgress.completedVideos);
    
    await courseProgress.save();

    const updated = await CourseProgress.findById(courseProgress._id);

console.log("Updated:", updated.completedVideos);
    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};