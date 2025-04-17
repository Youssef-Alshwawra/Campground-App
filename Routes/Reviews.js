const express =  require('express');
const router = express.Router( {mergeParams: true} );
const catchAsync = require('../Utils/CatchAsync');

const ExpressError = require('../Utils/ExpressError');
const { reviewSchema } = require('../SchemasValidation');

const Review = require('../Models/Review');
const Campground = require('../Models/Campground');

const reviewsController = require('../Controllers/ReviewsController');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.creatingReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview) );

module.exports = router;