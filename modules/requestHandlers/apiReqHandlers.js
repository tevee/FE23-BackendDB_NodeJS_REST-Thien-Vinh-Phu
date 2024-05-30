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
        GROUP BY s.id
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

export async function getCoursesBySpecificWord(req, res) {
    let sql = '';

    console.log(Object.keys(req.params)[0], Object.values(req.params)[0]);

    if(Object.entries(req.params).length > 0) sql = `
        SELECT c.name AS course
        FROM courses c
        WHERE c.${Object.keys(req.params)[0]} LIKE '%${Object.values(req.params)[0]}%'
    ;`;

    try {
        const dbData = await db.query(sql);
        console.log(dbData);
        res.json(dbData);
    } catch (error) {
        console.error(`Error fetching ${req.params} data:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Checks for fields in request query matches requiredFields
function checkRequiredFields(requestQuery, requiredFields) {
    for (const field of requiredFields) {
        if(!requestQuery.hasOwnProperty(field)) return false;
    }
    return true;
}

// Create data for selected table
export function createData(tableName, requiredFields) {
    return async (req, res) => {
        const requestBody = req.body
        console.log('req body', requestBody);

        if(!checkRequiredFields(requestBody, requiredFields)) {
            return res.status(400).json({ error: `${requiredFields.join(", ")} are required fields` });
        }

        const keys = Object.keys(requestBody).join(', ');
        const values = Object.values(requestBody).map((value) => {
            if(typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            else return value;
        }).join(', ');
        console.log('keys', keys);
        console.log('values', values);

        const sqlCreateQuery = `
            INSERT INTO ${tableName}
            (${keys})
            VALUES (${values});
        `;
        console.log(sqlCreateQuery);
        
        try {
            const dbData = await db.query(sqlCreateQuery);
            console.log(dbData);
            res.json(dbData);
        } catch (error) {
            console.error(`Error executing SQL query:`, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export function deleteData(tableName) {
    return async (req, res) => {
        console.log(req.body);
        const {id} = req.body;
        console.log(id);

        if(!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing ID parameter' });
        }

        try {
            if(tableName !== 'students_courses') {
                await db.query(`DELETE FROM students_courses WHERE ${tableName}_id = ${id};`);
            }
            const dbData = await db.query(`DELETE FROM ${tableName} WHERE id = ${id};`);
            console.log(dbData);
            res.json(dbData);
        } catch (error) {
            console.error(`Error executing SQL query:`, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}