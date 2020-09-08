const mongoose = require("mongoose");

const ImagesSchema = mongoose.Schema({
    imgPath: {type: String},
}, {
    toJSON: {
        transform(doc, ret) {
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
            Reflect.deleteProperty(ret, '__t');
            ret.id = doc._id;
            ret.fullName = doc.fullName;
        }
    }
})

const Image = mongoose.model('Image', ImagesSchema);

module.exports = Image;
