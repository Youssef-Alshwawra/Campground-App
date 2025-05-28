const Review = require('../Models/Review');
const Course = require('../Models/Course');

module.exports.creatingReview = async (req, res) => {
    const { id } = req.params;
    const { rating, body } = req.body.review;
    if (!rating) {
        req.flash('error', 'Enter your rating!')
        return res.redirect(`/courses/${id}`);
    }
    const course = await Course.findById(id);
    const review = new Review({rating, body});
    course.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await course.save();
    req.flash('success', 'Created new Review Successfuly!')
    res.redirect(`/courses/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId, id } = req.params;
    await Course.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review!')
    res.redirect(`/courses/${id}`);
}