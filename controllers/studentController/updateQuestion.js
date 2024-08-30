const { Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');
const { ObjectId } = require('mongodb');

exports.updateQuestion = async (req, res) => {
  const { simulatorTitle, moduleTitle, questionId, answeredOption, isCorrect, timeTaken } = req.body;
  console.log(simulatorTitle, moduleTitle, questionId, answeredOption, isCorrect, timeTaken);

  try {
    await connectToMongoDB();
    const studentId = new ObjectId(req.user.id); // Assuming req.user.id is set correctly

    // Find the student by studentId
    const student = await Student.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the correct simulator
    const simulator = student.simulatorsPurchased.find(sim => sim.manualSimulatorId === simulatorTitle);

    if (!simulator) {
      return res.status(404).json({ message: "Simulator not found" });
    }

    // Find the correct module, or create a new one if it doesn't exist
    let module = simulator.modules.find(mod => mod.moduleName === moduleTitle);

    if (!module) {
      module = {
        moduleId: new ObjectId(), // Generate a new ObjectId for the new module
        moduleName: moduleTitle,
        totalQuestions: 0,
        questionsSolved: [],
        questionsRemaining: 0
      };
      simulator.modules.push(module);
    }

    // Update the questionsSolved array
    const questionIndex = module.questionsSolved.findIndex(q => q.questionId.toString() === questionId);

    if (questionIndex === -1) {
      module.questionsSolved.push({
        questionId,
        questionText: req.body.questionText,
        answeredOption,
        isCorrect,
        correctOption: req.body.correctOption,
        explanation: req.body.explanation,
        timeTaken,
        solvedAt: new Date()
      });
    } else {
      module.questionsSolved[questionIndex] = {
        questionId,
        questionText: req.body.questionText,
        answeredOption,
        isCorrect,
        correctOption: req.body.correctOption,
        explanation: req.body.explanation,
        timeTaken,
        solvedAt: new Date()
      };
    }

    module.questionsRemaining = module.totalQuestions - module.questionsSolved.length;

    await student.save();

    res.status(200).json({ message: "Question updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
