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
router.get('/dashboard', authenticateJWT, getInstructorDashboardData);
// router.get('/dashboard/students', authenticateJWT, getAllStudents);
router.get('/dashboard/students', authenticateJWT, getAllStudents);
router.get('/dashboard/student/:id', authenticateJWT, getStudentDetails);
router.post('/dashboard/setAvailability', authenticateJWT, setAvailability);
router.get('/dashboard/getAvailability', authenticateJWT, getAvailability);
router.delete('/dashboard/deleteAvailability/:slotId', authenticateJWT, deleteAvailability);
router.get('/dashboard/getMeetingDetails', authenticateJWT, getMeetingDetails);
router.post('/dashboard/addMeetingLink', authenticateJWT, setMeetingDetails);




module.exports = router;
