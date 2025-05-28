const express = require("express");
const router = express.Router();
const catchAsync = require("../Utils/CatchAsync");
const courseController = require("../Controllers/CourseController");

const { upload } = require("../middleware");

const { isLoggedIn, isAuthor, validateCourse } = require("../middleware");

router.route('/')
    .get(catchAsync(courseController.index))
    .post(
        isLoggedIn,
        upload.single('course[image]'),                    
        validateCourse,      
        catchAsync(courseController.creatingNewCourse)
    );

router.get("/new", isLoggedIn, courseController.createCourseForm);

router
  .route("/:id")
  .get(catchAsync(courseController.CourseDetails))
  .patch(
    isLoggedIn,
    isAuthor,
    upload.single('image'),
    validateCourse,
    catchAsync(courseController.UpdatingCourse)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(courseController.DeletingCourse));

router.get(
  "/:id/update",
  isLoggedIn,
  isAuthor,
  catchAsync(courseController.UpdateForm)
);

module.exports = router;
