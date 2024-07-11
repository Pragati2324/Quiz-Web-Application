// models/quiz.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [{ type: String, required: true }],
    validate: [arrayLimit, '{PATH} must have exactly 4 options']
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }
});

function arrayLimit(val) {
  return val.length === 4;
}

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timer: { type: Number, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model('Quiz', quizSchema);
