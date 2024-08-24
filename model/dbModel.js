const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Question schema for embedding within Simulator schema
const questionSchema = new Schema({
  question_id: Schema.Types.ObjectId,
  question_text: String,
  options: [String],
  correct_option: String,
  explanation: String,
  created_at: Date,
  updated_at: Date
});

const simulatorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    simulatorId: String, // e.g., 'S001'
    title: String,
    courseId: mongoose.Schema.Types.ObjectId,
    modules: [
      {
        title: String,
        questions: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            questionText: String,
            options: [String],
            correctOption: String,
            explanation: String
          }
        ],
        completionStatus: [
          {
            studentId: mongoose.Schema.Types.ObjectId,
            percentageCompleted: Number, // e.g., 40 for 40%
            completedQuestions: [
              {
                questionId: mongoose.Schema.Types.ObjectId,
                answeredOption: String,
                isCorrect: Boolean,
                timeTaken: Number,
                solvedAt: Date
              }
            ]
          }
        ]
      }
    ]
  });
  

// Define Course schema
const courseSchema = new Schema({
  title: String,
  description: String,
  courseId: String, // e.g., '001', '002'
  simulators: [{ type: Schema.Types.ObjectId, ref: 'Simulator' }],
  price: Number,
  created_at: Date,
  updated_at: Date
});

const studentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    coursesEnrolled: [
      {
        courseId: mongoose.Schema.Types.ObjectId,
        manualCourseId: String, // e.g., '001', '002'
        progress: Number, // e.g., 100 for complete
        simulatorsPurchased: [
          {
            simulatorId: mongoose.Schema.Types.ObjectId,
            manualSimulatorId: String, // e.g., 'S001'
            modules: [
              {
                moduleId: mongoose.Schema.Types.ObjectId,
                moduleName: String,
                totalQuestions: Number,
                questionsSolved: [
                  {
                    questionId: mongoose.Schema.Types.ObjectId,
                    questionText: String,
                    answeredOption: String,
                    isCorrect: Boolean,
                    correctOption: String,
                    explanation: String,
                    timeTaken: Number, // Optional
                    solvedAt: Date // Optional
                  }
                ],
                questionsRemaining: Number
              }
            ]
          }
        ],
        simulatorsCompleted: [
          {
            simulatorId: mongoose.Schema.Types.ObjectId,
            manualSimulatorId: String, // e.g., 'S001'
            modulesCompleted: [
              {
                moduleId: mongoose.Schema.Types.ObjectId,
                moduleName: String,
                percentageCompleted: Number, // e.g., 100 for complete
                totalQuestions: Number,
                completedQuestions: [
                  {
                    questionId: mongoose.Schema.Types.ObjectId,
                    questionText: String,
                    answeredOption: String,
                    isCorrect: Boolean,
                    correctOption: String,
                    explanation: String
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    pastMeetings: [mongoose.Schema.Types.ObjectId]
  });
  

// Define Instructor schema
const instructorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    availableSlots: [
      {
        day: {
          type: String, // e.g., 'Monday'
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        times: [
          {
            start: Date,
            end: Date,
            bookedBy: {
              studentId: mongoose.Schema.Types.ObjectId,
              studentEmail: String
            }
          }
        ]
      }
    ],
    meetingsScheduled: [mongoose.Schema.Types.ObjectId] // Array of scheduled meeting IDs
  });
  

// Models
const Student = mongoose.model('Student', studentSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);
const Course = mongoose.model('Course', courseSchema);
const Simulator = mongoose.model('Simulator', simulatorSchema);
const Question = mongoose.model('Question', questionSchema);

// Export models
module.exports = { Student, Instructor, Course, Simulator, Question};
