const express =  require('express');
const router = express.Router();
const catchAsync = require('../Utils/CatchAsync');
const campgroundController = require('../Controllers/CampgroundsController');

const Campground = require('../Models/Campground');

const multer = require('multer');
const upload = multer({ dest: 'upload/'});

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// first way:
// router.get( '/', catchAsync(campgroundController.index) );

// router.post('/', isLoggedIn, validateCampground, catchAsync (campgroundController.creatingNewCampground) );

// second way: (shorter)
router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.creatingNewCampground))

router.get('/new', isLoggedIn, campgroundController.createCampgroundForm);

// first way:
// router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync (campgroundController.UpdatingCampground));

// router.get('/:id', catchAsync (campgroundController.CampgroundDetails));

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync (campgroundController.DeletingCampground));

// second way: (shorter)
router.route('/:id')
    .get(catchAsync (campgroundController.CampgroundDetails))
    .patch(isLoggedIn, isAuthor, validateCampground, catchAsync (campgroundController.UpdatingCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgroundController.DeletingCampground));

router.get('/:id/update', isLoggedIn, isAuthor, catchAsync (campgroundController.UpdateForm));

module.exports = router; 