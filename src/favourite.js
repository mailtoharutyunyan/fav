const mongoose = require("mongoose");
const Image = require('./image')

const FavouriteSchema = mongoose.Schema({
        title: {type: String},
        description: {type: String},
        images: [{type: mongoose.Schema.Types.ObjectId, required: true,ref:'Image'}]
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
    }
);


const Favourite = mongoose.model('Alarm', FavouriteSchema);

module.exports = Favourite;
