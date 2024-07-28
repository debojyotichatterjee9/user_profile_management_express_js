const mongoose = require('mongoose');

exports.objectIdValidator = (objectId) => {
return mongoose.Types.ObjectId.isValid(objectId);
}