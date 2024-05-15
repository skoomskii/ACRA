const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    CaseID: { type: Number, required: true },
    DoH: { type: String, required: true },
    DoNH: { type: String, required: true },
    PersonsPresent: { type: String, required: true },
    StartoH: { type: String, required: true },
    EndoH: { type: String, required: true },
    Directions: { type: String, required: true }
});

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;