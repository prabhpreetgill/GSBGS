const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    parentFname: { type: String, required: true },
    parentMname: { type: String },
    parentLname: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: { type: String, required: true },
    paid: { type: Boolean, required: true },
    attendance: [{ date: Date, status: Boolean }] // Assuming attendance is a list of dates and status
});

module.exports = mongoose.model('Student', studentSchema);

const taSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // Assuming classes are referenced by ObjectIds
    attendance: [{ date: Date, status: Boolean }]
});

module.exports = mongoose.model('TA', taSchema);

const teacherSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    department: { type: String }, // Department name as a string, could be a reference if departments are separate entities
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    attendance: [{ date: Date, status: Boolean }]
});

module.exports = mongoose.model('Teacher', teacherSchema);