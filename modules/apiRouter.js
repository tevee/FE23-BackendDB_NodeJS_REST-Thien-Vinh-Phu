import { Router } from "express";
import * as api from "./requestHandlers/apiReqHandlers.js";

const apiRouter = Router();

// Student routes
apiRouter.route('/students').get(api.getDataByTable('students')); // request query for specific student by id
apiRouter.route('/students/:identifier/courses').get(api.getCoursesByStudent); // identifier can be id, fName, lName or town
apiRouter.route('/createStudent').post(api.createData('students', ['fName', 'lName', 'town']));
apiRouter.route('/deleteStudent').post(api.deleteData('students'));


// Course routes
apiRouter.route('/courses').get(api.getDataByTable('courses'));
apiRouter.route('/courses/name/:name').get(api.getCoursesBySpecificWord);
apiRouter.route('/courses/description/:description').get(api.getCoursesBySpecificWord);
apiRouter.route('/courses/:identifier/students').get(api.getStudentsByCourses);
apiRouter.route('/createCourse').post(api.createData('courses', ['name', 'description']));
apiRouter.route('/deleteCourse').post(api.deleteData('courses'));

// Associations
apiRouter.route('/studentsCourses').get(api.getDataByTable('students_courses'));
apiRouter.route('/createStudentsCourses').post(api.createData('students_courses', ['students_id', 'courses_id']));
apiRouter.route('/deleteStudentsCourses').post(api.deleteData('students_courses'));

export {apiRouter}