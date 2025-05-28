const Course = require('../Models/Course');
const cities = require('../seeds/cities');

module.exports.index = async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index.ejs', { courses });
};

module.exports.createCourseForm = (req, res) => { 
    res.render('courses/new.ejs', {cities});
};

// module.exports.creatingNewCourse = async (req, res, next) => {
//     const {title, price, description, location, image} = req.body.course;
//     const newCourse = new Course({ title, price, description, location, image});
//     newCourse.author = req.user._id;
//     await newCourse.save();
//     req.flash('success', 'Sucessfuly made a new course!');
//     res.redirect(`/courses/${newCourse._id}`);
// };

module.exports.creatingNewCourse = async (req, res, next) => {
    try {
        // req.body.course has title, price, description, location
        const { title, price, description, duration, location } = req.body;

        // req.file holds the uploaded image
        if (!req.file) {
            req.flash('error', 'Course image is required');
            return res.redirect('/courses/new');
        }

        // Save the course, including the upload path
        const newCourse = new Course({
            title,
            price,
            description,
            location,
            duration,
            image: `/uploads/${req.file.filename}`, // or save absolute path
            author: req.user._id
        });
        await newCourse.save();

        req.flash('success', 'Successfully created a new course!');
        res.redirect(`/courses/${newCourse._id}`);
    } catch (err) {
        next(err);
    }
  };

module.exports.UpdatingCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Build an update object from the form fields
        const updateData = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location
        };

        // If a new file was uploaded, overwrite the image path
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
            // Optionally: delete old file from disk here
        }

        const course = await Course.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        req.flash('success', 'Successfully updated course!');
        res.redirect(`/courses/${course._id}`);
    } catch (err) {
        next(err);
    }
  };

module.exports.UpdateForm = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if(!course) {
        req.flash('error', 'Cannot Find that course!');
        return res.redirect(`/courses`);
    }
    res.render('courses/update.ejs', { course, cities });
}

module.exports.CourseDetails = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate({
        path: 'reviews',
               populate: {
                path: 'author'
            }
    }).populate('author');
    if(!course) {
        req.flash('error', 'Cannot find that course!');
        res.redirect('/courses');
    }    
    res.render('courses/details.ejs', { course });
}

module.exports.DeletingCourse = async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    req.flash('success', 'Sucessfuly deleted a Course!')
    res.redirect('/Courses');
};