const mongoose = require('mongoose');
const Course = require('../Models/Course');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/EduPilot');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection err:"));
db.once("open", () => {
    console.log("database is connected sucessfuly");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Course.deleteMany({});
    for(let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const course = new Course({
            author: '6720e5b9d7df5f682cf29952',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores pariatur dolore nemo vel, fuga assumenda sed in voluptas consequatur deserunt error laboriosam iure similique magnam nulla, amet cupiditate exercitationem quo!',
            price
            });
        await course.save()
    }
}   

seedDb().then( () => {
    mongoose.connection.close();
})