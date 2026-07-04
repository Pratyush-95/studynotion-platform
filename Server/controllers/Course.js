const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const mongoose = require("mongoose");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/SecToDuration");

exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    if (!courseName || !courseName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course name is required",
  });
}

    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({
      success: false,
      message: "Thumbnail is required",
    });
  }

    const thumbnail = req.files.thumbnailImage;

    //const tag = JSON.parse(_tag);
    //const instructions = JSON.parse(_instructions);

    let tag;
    let instructions;

try {
  tag =
    typeof _tag === "string"
      ? JSON.parse(_tag)
      : _tag;

  instructions =
    typeof _instructions === "string"
      ? JSON.parse(_instructions)
      : _instructions;
} catch (error) {
  return res.status(400).json({
    success: false,
    message: "Invalid tag or instructions format",
  });
}

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      price  === undefined||
      price === null || 
      !tag||
      tag.length === 0 ||
      !thumbnail ||
      !category ||
      !instructions ||
      instructions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
    });
  }
    if (!status || status === undefined) {
      status = "Pending";
    }

    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    if (instructorDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only Instructor can create courses",
      });
    }

    if (!instructorDetails.approved) {
      return res.status(403).json({
      success: false,
      message: "Instructor account is pending for approval",
    });
  }


     if (!mongoose.Types.ObjectId.isValid(category)) {
  return res.status(400).json({
    success: false,
    message: "Invalid Category ID",
  });
}

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }


    

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const updates = { ...req.body };
    delete updates.courseId;

    if (
  updates.price !== undefined &&
  (isNaN(updates.price) || Number(updates.price) < 0)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid course price",
  });
}
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

     const oldCategoryId = course.category?.toString();

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  if (
  updates.category &&
  !mongoose.Types.ObjectId.isValid(updates.category)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid Category ID",
  });
}

  if (updates.category) {
  const categoryExists = await Category.findById(updates.category);

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
}

     // thumbnail update
    if (req.files && req.files.thumbnailImage) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
          const value = updates[key];
          if (typeof value === "string") {
            try {
              course[key] = JSON.parse(value);
            } catch (parseError) {
              course[key] = value;
            }
          } else {
            course[key] = value;
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    if (
  updates.category &&
  updates.category !== oldCategoryId
) {
  await Category.findByIdAndUpdate(
    oldCategoryId,
    {
      $pull: {
        courses: course._id,
      },
    }
  );

  await Category.findByIdAndUpdate(
    updates.category,
    {
      $addToSet: {
        courses: course._id,
      },
    }
  );
}

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnroled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
  return res.status(400).json({
    success: false,
    message: "Course ID is required",
  });
}
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
  return res.status(400).json({
    success: false,
    message: "Course ID is required",
  });
}
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid Course ID",
  });
}

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }
    

    // Category cleanup
    await Category.findByIdAndUpdate(
      course.category,
      {
        $pull: {
        courses: courseId,
      },
    }
  );

  // Instructor cleanup
  await User.findByIdAndUpdate(
    course.instructor,
    {
      $pull: {
      courses: courseId,
    },
  }
);

  const studentsEnrolled = course.studentsEnroled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    const courseSections = course.courseContent;

      await CourseProgress.deleteMany({
        courseID: courseId,
      });

    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Stream subsection video through server to avoid CORS/format issues
exports.streamSubSectionVideo = async (req, res) => {
  try {
    const { subSectionId } = req.query;
    if (!subSectionId) {
      return res.status(400).json({ success: false, message: "subSectionId required" });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection || !subSection.videoUrl) {
      return res.status(404).json({ success: false, message: "SubSection or video not found" });
    }

    const videoUrl = String(subSection.videoUrl);
    let parsed ;

    try {
  parsed = new URL(videoUrl);
  const allowedHosts = [
  "res.cloudinary.com",
];

if (!allowedHosts.includes(parsed.hostname)) {
  return res.status(400).json({
    success: false,
    message: "Invalid video host",
  });
}
} catch {
  return res.status(400).json({
    success: false,
    message: "Invalid video URL",
  });
}
    const protocol = parsed.protocol === 'http:' ? require('http') : require('https');

    protocol.get(videoUrl, (streamRes) => {
      const statusCode = streamRes.statusCode || 200;
      res.statusCode = statusCode;
      // forward content-type if available, else default to video/mp4
      const contentType = streamRes.headers['content-type'] || 'video/mp4';
      res.setHeader('Content-Type', contentType);
      if (streamRes.headers['content-length']) {
        res.setHeader('Content-Length', streamRes.headers['content-length']);
      }
      // allow CORS from dev client
      res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");

      streamRes.on('error', (err) => {
        console.error('Error streaming remote video:', err);
        if (!res.headersSent) res.status(500).end('Error streaming video');
      });

      streamRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error fetching video URL:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch video' });
    });
  } catch (error) {
    console.error('streamSubSectionVideo error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};