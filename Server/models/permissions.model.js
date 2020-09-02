const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    permissions: { type: [], required: true }
});

const permissionModel = mongoose.model('permissions', permissionSchema);
module.exports = permissionModel;
