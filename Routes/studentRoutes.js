const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {getStudentDashboardData}=require('../controllers/studentController/dashboardController');
const {getCourses}=require('../controllers/studentController/coursesController');
const {getSimulators}=require('../controllers/studentController/simulatorController')
const {getInstructorAvailability}=require('../controllers/studentController/getInstructorAvailability');
const {bookSlot}=require('../controllers/studentController/bookSlot')
const {getCourseDetail}=require('../controllers/studentController/getCourseDetails')
const {getSimulatorDetails}=require('../controllers/studentController/simulatorController')
const {getModuleDetails}=require('../controllers/studentController/simulatorController')
const {updateQuestion}=require('../controllers/studentController/updateQuestion')
const{getPaymentDetails}=require('../controllers/studentController/paymentController')

const router = express.Router();

// Public routes
router.get('/dashboard',  getStudentDashboardData);
router.get('/dashboard/payments',getPaymentDetails);
router.get('/dashboard/simulators',  getSimulators);
router.get('/dashboard/simulators/:title',  getSimulatorDetails);
router.get('/dashboard/simulators/:title/:moduleTitle',  getModuleDetails);
router.post('/dashboard/simulator/updateQuestion',  updateQuestion);


router.get('/dashboard/courses',  getCourses);
router.get('/dashboard/getInstructorAvailability',  getInstructorAvailability);
router.post('/dashboard/bookSlot',  bookSlot);
router.get('/dashboard/course/courseDetail',  getCourseDetail);




module.exports = router;
