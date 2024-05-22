import * as db from "../../db.js";

export function getDataByTable(tableName) {
    return async (req, res) => {
        let sql = "";
        const {id} = req.query;

        if (id) sql = `SELECT * FROM ${tableName} WHERE id = ${id}`;
        else sql = `SELECT * FROM ${tableName}`;

        try {
            const dbData = await db.query(sql);
            console.log(dbData);
            res.json(dbData);
        } catch (error) {
            console.error(`Error fetching ${tableName} data:`, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export async function getCoursesByStudent(req, res) {
    const {identifier} = req.params;
    let sql = '';

    if(identifier) sql = `
    SELECT s.fName, GROUP_CONCAT(c.name SEPARATOR ', ') AS course FROM students s 
    JOIN students_courses sc ON s.id = sc.students_id 
    JOIN courses c ON sc.courses_id = c.id 
    WHERE s.id = '${identifier}' 
    OR s.fName = '${identifier}' 
    OR s.lName = '${identifier}'
    OR s.town = '${identifier}'
    GROUP BY s.id;`;

    try {
        const dbData = await db.query(sql);
        console.log(dbData);
        res.json(dbData);
    } catch (error) {
        console.error(`Error fetching ${identifier} data:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getStudentsByCourses(req, res) {
    const {identifier} = req.params;
    let sql = '';

    if(identifier) sql = `
    SELECT c.name AS course, s.fName FROM students s 
    JOIN students_courses sc ON s.id = sc.students_id 
    JOIN courses c ON sc.courses_id = c.id 
    WHERE c.id = '${identifier}' 
    OR c.name = '${identifier}' 
    ;`;

    try {
        const dbData = await db.query(sql);
        console.log(dbData);
        res.json(dbData);
    } catch (error) {
        console.error(`Error fetching ${identifier} data:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getCourseBySpecificWord(req, res) {
    const {identifier} = req.params;
    let sql = '';

    if(identifier) sql = `
    SELECT c.name AS course, s.fName FROM students s 
    JOIN students_courses sc ON s.id = sc.students_id 
    JOIN courses c ON sc.courses_id = c.id 
    WHERE c.id = '${identifier}' 
    OR c.name = '${identifier}' 
    ;`;

    try {
        const dbData = await db.query(sql);
        console.log(dbData);
        res.json(dbData);
    } catch (error) {
        console.error(`Error fetching ${identifier} data:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}