const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {getInstructorDashboardData}=require('../controllers/instructorController/dashboardController');
const{getAllStudents}=require('../controllers/instructorController/getAllStudentsController')
const {getStudentDetails}=require('../controllers/instructorController/getStudentController')
const{setAvailability}=require('../controllers/instructorController/setAvailability');
const {getAvailability}=require('../controllers/instructorController/getAvailability');
const {deleteAvailability}=require('../controllers/instructorController/deleteAvailability');
const{getMeetingDetails}=require('../controllers/instructorController/getMeetingDetail')
const {setMeetingDetails}=require('../controllers/instructorController/setMeetingDetails');
const router = express.Router();

// Public routes
router.get('/dashboard',  getInstructorDashboardData);
// router.get('/dashboard/students', authenticateJWT, getAllStudents);
router.get('/dashboard/students',  getAllStudents);
router.get('/dashboard/student/:id',  getStudentDetails);
router.post('/dashboard/setAvailability',  setAvailability);
router.get('/dashboard/getAvailability',  getAvailability);
router.delete('/dashboard/deleteAvailability/:slotId',  deleteAvailability);
router.get('/dashboard/getMeetingDetails',  getMeetingDetails);
router.post('/dashboard/addMeetingLink',  setMeetingDetails);




module.exports = router;
