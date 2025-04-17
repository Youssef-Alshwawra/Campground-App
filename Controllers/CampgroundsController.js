const Campground = require('../Models/Campground');
const cities = require('../seeds/cities');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
};

module.exports.createCampgroundForm = (req, res) => { 
    res.render('campgrounds/new.ejs', {cities});
};

module.exports.creatingNewCampground = async (req, res, next) => {
    const {title, price, description, location, image} = req.body.campground;
    const newCamp = new Campground({ title, price, description, location, image});
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Sucessfuly made a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.UpdatingCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Sucessfuly updated campground!');
    res.redirect(`/campgrounds/${campground._id}/`);
}

module.exports.UpdateForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/update.ejs', { campground, cities });
}

module.exports.CampgroundDetails = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
               populate: {
                path: 'author'
            }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }    
    res.render('campgrounds/details.ejs', { campground });
}

module.exports.DeletingCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Sucessfuly deleted a Campground!')
    res.redirect('/campgrounds');
};