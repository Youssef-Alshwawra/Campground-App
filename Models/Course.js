const mongoose = require('mongoose');
const Review = require('./Review');
const { courseSchema } = require('../SchemasValidation');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    duration: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
    
});

CourseSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Course', CourseSchema);