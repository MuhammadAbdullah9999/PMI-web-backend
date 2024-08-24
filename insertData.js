const bcrypt = require('bcrypt');
const { Student, Instructor, Course, Simulator } = require('./model/dbModel');
const { connectToMongoDB } = require('./services/authService');
const mongoose = require('mongoose');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function insertLargeData() {
  await connectToMongoDB();

  const hashedPassword = await hashPassword('123456');

  // Manually Insert Instructor
  const instructorData = {
    _id: new mongoose.Types.ObjectId(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: hashedPassword,
    availableSlots: [
      // Define slots as needed
    ],
    meetingsScheduled: []
  };
  const insertedInstructor = await Instructor.create(instructorData);
  console.log(`Inserted instructor with ID: ${insertedInstructor._id}`);

  // Manually Insert Courses
  const courses = [
    {
      _id: new mongoose.Types.ObjectId(),
      courseId: '001',
      title: 'Introduction to Project Management',
      description: 'Learn the basics of project management.',
      simulators: [],
      price: '99.99',
    },
    {
      _id: new mongoose.Types.ObjectId(),
      courseId: '002',
      title: 'Advanced Project Management',
      description: 'Deep dive into advanced project management techniques.',
      simulators: [],
      price: '149.99',
    },
  ];
  const insertedCourses = await Course.insertMany(courses);
  console.log(`Inserted ${insertedCourses.length} courses`);

  // Manually Insert Simulators with Modules and Questions
  const simulators = [
    {
      _id: new mongoose.Types.ObjectId(),
      simulatorId: 'S001',
      title: 'Project Management Simulator 1',
      courseId: insertedCourses[0]._id,
      modules: [
        {
          title: 'Module 1',
          questions: [
            {
              _id: new mongoose.Types.ObjectId(),
              questionText: 'What is the primary goal of project management?',
              options: [
                'To increase profits',
                'To meet deadlines',
                'To manage resources effectively',
                'To reduce costs'
              ],
              correctOption: 'To manage resources effectively',
              explanation: 'Effective resource management is crucial for successful project outcomes.'
            }
          ],
          completionStatus: []
        }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      simulatorId: 'S002',
      title: 'Project Management Simulator 2',
      courseId: insertedCourses[1]._id,
      modules: [
        {
          title: 'Module 1',
          questions: [
            {
              _id: new mongoose.Types.ObjectId(),
              questionText: 'What does a project manager do?',
              options: [
                'Design products',
                'Develop software',
                'Oversee project execution',
                'Handle customer service'
              ],
              correctOption: 'Oversee project execution',
              explanation: 'The project manager is responsible for overseeing the execution of projects.'
            }
          ],
          completionStatus: []
        }
      ]
    }
  ];
  const insertedSimulators = await Simulator.insertMany(simulators);
  console.log(`Inserted ${insertedSimulators.length} simulators`);

  // Update courses to include simulators
  for (let i = 0; i < insertedCourses.length; i++) {
    insertedCourses[i].simulators.push(
      insertedSimulators[i % insertedSimulators.length]._id
    );
    await insertedCourses[i].save();
  }

  // Manually Insert Students
  const students = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: hashedPassword,
      coursesEnrolled: [
        {
          courseId: insertedCourses[0]._id,
          manualCourseId: '001',
          progress: 100,
          simulatorsPurchased: [
            {
              simulatorId: insertedSimulators[0]._id,
              manualSimulatorId: 'S001',
              modules: [
                {
                  moduleId: insertedSimulators[0].modules[0]._id,
                  moduleName: insertedSimulators[0].modules[0].title,
                  totalQuestions: insertedSimulators[0].modules[0].questions.length,
                  questionsSolved: [
                    {
                      questionId: insertedSimulators[0].modules[0].questions[0]._id,
                      questionText: insertedSimulators[0].modules[0].questions[0].questionText,
                      answeredOption: 'To manage resources effectively',
                      isCorrect: true,
                      correctOption: 'To manage resources effectively',
                      explanation: 'Effective resource management is crucial for successful project outcomes.',
                      timeTaken: 150, // Optional
                      solvedAt: new Date() // Optional
                    }
                  ],
                  questionsRemaining: 0 // Adjust based on progress
                }
              ]
            }
          ],
          simulatorsCompleted: [
            {
              simulatorId: insertedSimulators[0]._id,
              manualSimulatorId: 'S001',
              modulesCompleted: [
                {
                  moduleId: insertedSimulators[0].modules[0]._id,
                  moduleName: insertedSimulators[0].modules[0].title,
                  percentageCompleted: 100,
                  totalQuestions: insertedSimulators[0].modules[0].questions.length,
                  completedQuestions: [
                    {
                      questionId: insertedSimulators[0].modules[0].questions[0]._id,
                      questionText: insertedSimulators[0].modules[0].questions[0].questionText,
                      answeredOption: 'To manage resources effectively',
                      isCorrect: true,
                      correctOption: 'To manage resources effectively',
                      explanation: 'Effective resource management is crucial for successful project outcomes.'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      pastMeetings: []
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      password: hashedPassword,
      coursesEnrolled: [
        {
          courseId: insertedCourses[1]._id,
          manualCourseId: '002',
          progress: 100,
          simulatorsPurchased: [
            {
              simulatorId: insertedSimulators[1]._id,
              manualSimulatorId: 'S002',
              modules: [
                {
                  moduleId: insertedSimulators[1].modules[0]._id,
                  moduleName: insertedSimulators[1].modules[0].title,
                  totalQuestions: insertedSimulators[1].modules[0].questions.length,
                  questionsSolved: [
                    {
                      questionId: insertedSimulators[1].modules[0].questions[0]._id,
                      questionText: insertedSimulators[1].modules[0].questions[0].questionText,
                      answeredOption: 'Oversee project execution',
                      isCorrect: true,
                      correctOption: 'Oversee project execution',
                      explanation: 'The project manager is responsible for overseeing the execution of projects.',
                      timeTaken: 200, // Optional
                      solvedAt: new Date() // Optional
                    }
                  ],
                  questionsRemaining: 0 // Adjust based on progress
                }
              ]
            }
          ],
          simulatorsCompleted: [
            {
              simulatorId: insertedSimulators[1]._id,
              manualSimulatorId: 'S002',
              modulesCompleted: [
                {
                  moduleId: insertedSimulators[1].modules[0]._id,
                  moduleName: insertedSimulators[1].modules[0].title,
                  percentageCompleted: 100,
                  totalQuestions: insertedSimulators[1].modules[0].questions.length,
                  completedQuestions: [
                    {
                      questionId: insertedSimulators[1].modules[0].questions[0]._id,
                      questionText: insertedSimulators[1].modules[0].questions[0].questionText,
                      answeredOption: 'Oversee project execution',
                      isCorrect: true,
                      correctOption: 'Oversee project execution',
                      explanation: 'The project manager is responsible for overseeing the execution of projects.'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      pastMeetings: []
    }
  ];
  const insertedStudents = await Student.insertMany(students);
  console.log(`Inserted ${insertedStudents.length} students`);

  console.log('Data insertion complete');
}

insertLargeData().catch(console.error);
