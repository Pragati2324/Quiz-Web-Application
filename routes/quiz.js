const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Route to fetch all quizzes
// router.get('/quizzes', async (req, res) => {
//   try {
//       const quizzes = await Quiz.find().populate('questions'); // Assuming questions are populated in Quiz model
//       res.json(quizzes);
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server Error' });
//   }
// });

// Get quiz by ID
router.get('/:id', getQuiz, (req, res) => {
  res.json(res.quiz);
});

// Add quiz
router.post('/', async (req, res) => {
  const { title, description, timer, questions } = req.body;

  // Basic validation
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Title, questions array are required fields' });
  }

  const newQuiz = new Quiz({
    title,
    description,
    timer,
    questions,
  });

  try {
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error('Error adding quiz:', err.message);
    res.status(500).json({ message: 'Failed to add quiz' });
  }
});

// Update quiz
router.put('/:id', getQuiz, async (req, res) => {
  if (req.body.title != null) {
    res.quiz.title = req.body.title;
  }
  if (req.body.description != null) {
    res.quiz.description = req.body.description;
  }
  if (req.body.timer != null) {
    res.quiz.timer = req.body.timer;
  }
  if (req.body.questions != null) {
    res.quiz.questions = req.body.questions;
  }
  try {
    const updatedQuiz = await res.quiz.save();
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete quiz
router.delete('/:id', getQuiz, async (req, res) => {
    try {
      await Quiz.deleteOne({ _id: res.quiz._id });
      res.json({ message: 'Deleted Quiz' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  async function getQuiz(req, res, next) {
    let quiz;
    try {
      quiz = await Quiz.findById(req.params.id);
      if (quiz == null) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.quiz = quiz;
    next();
  }

module.exports = router;
