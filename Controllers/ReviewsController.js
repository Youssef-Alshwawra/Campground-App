const Review = require('../Models/Review');
const Campground = require('../Models/Campground');

module.exports.creatingReview = async (req, res) => {
    const { id } = req.params;
    const { rating, body } = req.body.review;
    if (!rating) {
        req.flash('error', 'Enter your rating!')
        return res.redirect(`/campgrounds/${id}`);
    }
    const campground = await Campground.findById(id);
    const review = new Review({rating, body});
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review Successfuly!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId, id } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review!')
    res.redirect(`/campgrounds/${id}`);
}