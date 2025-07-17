const { Schema, model } = require("mongoose");

// CREATE SCHEMA
const serviceSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

// CREATE MODEL
const Service = model("Service", serviceSchema);

module.exports = Service;
