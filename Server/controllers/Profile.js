const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");

const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../utils/SecToDuration");
const mailSender = require("../utils/mailSender");


const {
  accountDeletionEmail,
} = require("../mail/templates/AccountDeletionEmail");

const {
  accountDeletionCancelledEmail,
} = require("../mail/templates/accountDeletionCancelled");


exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    if (!firstName?.trim()) {
  return res.status(400).json({
    success: false,
    message: "First name is required",
  });
}

if (!lastName?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Last name is required",
  });
}

if (!dateOfBirth) {
  return res.status(400).json({
    success: false,
    message: "Date of birth is required",
  });
}

if (!gender) {
  return res.status(400).json({
    success: false,
    message: "Gender is required",
  });
}
    const id = req.user.id;

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure profile exists. If user has no additionalDetails, create one.
    let profile = null;
    if (userDetails.additionalDetails) {
      profile = await Profile.findById(userDetails.additionalDetails);
    }

    if (!profile) {
      profile = new Profile();
      await profile.save();
      userDetails.additionalDetails = profile._id;
      await userDetails.save();
    }

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );

    profile.dateOfBirth = dateOfBirth;
    // Server-side validation: ensure DOB is a valid date and not in the future
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date of birth" });
      }
      const now = new Date();
      if (dob > now) {
        return res.status(400).json({ success: false, message: "Date of birth cannot be in future" });
      }
    }
    profile.about = about;

   const normalize = (phone) => {
  const digits = (phone || "").toString().replace(/\D/g, "");

  return digits.slice(-10);
};

    if (contactNumber) {
      
      const normalizedInput = normalize(contactNumber);

      // Find any other profiles with a contactNumber and compare normalized forms
      const otherProfiles = await Profile.find({
        contactNumber: { $exists: true, $ne: null, $ne: "" },
        _id: { $ne: profile._id },
      });

      const conflict = otherProfiles.find((p) => normalize(p.contactNumber) === normalizedInput);

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered with another account",
        });
      }
    }
    
    profile.contactNumber =
    contactNumber?.trim()
    ? normalize(contactNumber)
    : undefined;

    profile.gender = gender;

    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);

     if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Phone number already registered",
    });
  }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    if (user.courses && user.courses.length) {
      for (const courseId of user.courses) {
        await Course.findByIdAndUpdate(
          courseId,
          { $pull: { studentsEnroled: id } },
          { new: true }
        );
      }
    }

    await User.findByIdAndDelete(id);

    await CourseProgress.deleteMany({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
    // await CourseProgress.deleteMany({ userId: id });
  } 
  catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length || 0;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,

        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.requestAccountDeletion = async (req, res) => {
  try {
    const userId = req.user.id;

    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + 7);

    const user = await User.findByIdAndUpdate(userId, {
      isDeleteRequested: true,
      deleteAt: deleteDate,
    },
     { new: true }
  );

  if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

  
    await mailSender(
      user.email,
      "StudyNotion Account Deletion Scheduled",
      accountDeletionEmail(user.firstName, deleteDate,  user._id)
    );

    return res.status(200).json({
      success: true,
      message: "Account scheduled for deletion after 7 days",
    });
  } 
  
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.cancelAccountDeletion = async (req,res)=>{
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleteRequested: false, deleteAt: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await mailSender(
      user.email,
      "Account Deletion Cancelled Successfully",
      accountDeletionCancelledEmail(user.firstName)
    );

    return res.status(200).json({ success: true, message: "Deletion cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Duplicate Phone Number Check Handler
exports.checkPhoneNumber = async (req, res) => {
  try {
    const { contactNumber } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
      success: false,
      message: "User not found",
    });
}

    const currentProfile = await Profile.findById(
      user.additionalDetails
    );

     const normalize = (phone) => {
  const digits = (phone || "").toString().replace(/\D/g, "");

  return digits.slice(-10);
};
    const normalizedInput = normalize(contactNumber);

    const allProfiles = await Profile.find({
      contactNumber: {
        $exists: true,
        $ne: null,
        $ne: "",
      },
      _id: {
        $ne: currentProfile?._id,
      },
    });

    const conflict = allProfiles.find(
      (p) =>
        normalize(p.contactNumber) === normalizedInput
    );

    if (conflict) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number already registered with another account",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Phone number available",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};