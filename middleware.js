const Course = require('./Models/Course');
const Review = require('./Models/Review');
const multer = require('multer');
const path = require('path');
const { courseSchema, reviewSchema } = require('./SchemasValidation');
const ExpressError = require('./Utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnToUrl = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    };
    next();
}; 

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnToUrl) {
        res.locals.returnToUrl = req.session.returnToUrl;
        delete req.session.returnToUrl;
    }
    next();
}

module.exports.validateCourse = (req, res, next) => {           
    const { error } = courseSchema.validate(req.body.course);
        if(error) { 
            const msg = error.details.map(el => el.message).join(', ');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course.author.equals(req.user._id) ) {
        req.flash('error', 'you do not have permission to do that!');
        return res.redirect(`/courses/${id}`);
    } 
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if( !review.author.equals(req.user._id) ) {
        req.flash('error', 'you do not have permission to do that!');
        return res.redirect(`/courses/${id}`);
    } 
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) { 
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Store in public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // __dirname is e.g. D:/…/EduPilot
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

// Optional: only accept images
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only images are allowed'), false);
};

module.exports.upload = multer({ storage, fileFilter });

module.exports.unpackCourse = (req, res, next) => {
    if (!req.body) return next();
    const course = {};
    for (let key in req.body) {
        const m = key.match(/^course\[(.+)\]$/);
        if (m) course[m[1]] = req.body[key];
    }
    req.body.course = course;
    next();
  };