const mpngoose = require('mongoose');

const saveSchema = new mpngoose.Schema({
    user: {
        type: mpngoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    food: {
        type: mpngoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
},{
    timestamps:true
})

const saveModel = mpngoose.model('save', saveSchema);

module.exports = saveModel;
