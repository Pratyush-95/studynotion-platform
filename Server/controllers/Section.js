const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// ================== CREATE SECTION ==================
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    // ✅ validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Course ID are required",
      });
    }

    // ✅ create section
    const newSection = await Section.create({ sectionName });

    // ✅ add section to course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // ✅ response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};


// ================== UPDATE SECTION ==================
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    // ✅ validation
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // ✅ get updated course
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // ✅ response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
      data: updatedCourse,
    });

  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message,
    });
  }
};


// ================== DELETE SECTION ==================
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    // ✅ validation
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Course ID are required",
      });
    }

    // ✅ check section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // ✅ delete all subsections inside it
    await SubSection.deleteMany({
      _id: { $in: section.subSection },
    });

    // ✅ remove section from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // ✅ delete section
    await Section.findByIdAndDelete(sectionId);

    // ✅ get updated course
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // ✅ response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error: error.message,
    });
  }
};