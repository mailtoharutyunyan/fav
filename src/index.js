const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const Favourite = require('./favourite');
const Image = require('./image');

const app = express();

mongoose.connect(`mongodb://localhost:27017/favourite`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
},)
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error));

mongoose.set('useFindAndModify', false);

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', async (req, res) => {
    const favourites = await Favourite.find({}).populate('images').exec();
    res.status(200).json(favourites);
});

app.post('/', async (req, res) => {
    const favourite = new Favourite();
    favourite.title = req.body.title;
    favourite.description = req.body.description;
    await favourite.save()
    res.status(201).json(favourite);
})
app.put('/:id', async (req, res) => {
    const favourite = await Favourite.findOne({_id: req.params.id}).exec()
    console.log(favourite)
    favourite.title = req.body.title;
    favourite.description = req.body.description;
    const dbfav = await favourite.save()
    res.status(200).json(dbfav);
})

app.delete('/:id', async (req, res) => {
    const favourite = await Favourite.findOne({_id: req.params.id}).exec()
    if (favourite) {
        let newVar = await Favourite.findByIdAndDelete({_id: req.params.id});
        res.status(200).json(newVar)
    }
})


app.post('/fav/:id', async (req, res) => {
    const id = req.params.id;
    const favourite = await Favourite.findOne({_id: id}).exec();

    if (favourite) {
        const image = new Image();
        image.imgPath = req.body.imgPath;
        await image.save();
        await favourite.images.push(image);
        await favourite.save();
    }
    res.status(200).json(favourite);

});

app.listen(3000, () => console.log('express started'));
