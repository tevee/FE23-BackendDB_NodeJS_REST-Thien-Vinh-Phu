import { Router } from "express";
import * as api from "./requestHandlers/apiReqHandlers.js";

const apiRouter = Router();

// Student routes
apiRouter.route('/students').get(api.getDataByTable('students'));
apiRouter.route('/students/:identifier/courses').get(api.getCoursesByStudent);

// Course routes
apiRouter.route('/courses').get(api.getDataByTable('courses'));
apiRouter.route('courses/:identifier').get(api.getCourseBySpecificWord);
apiRouter.route('/courses/:identifier/students').get(api.getStudentsByCourses);

// Associations
apiRouter.route('/studentsCourses').get(api.getDataByTable('students_courses'));

export {apiRouter}