import * as db from "../../db.js";

async function getTables(){
    const sql = 'SHOW tables';
    const dbTables = await db.query(sql);
    return dbTables
}

async function deleteRow(tableName, id) {
    if(tableName !== 'students_courses') {
        await db.query(`DELETE FROM students_courses WHERE ${tableName}_id = ${id};`);
    }
    await db.query(`DELETE FROM ${tableName} WHERE id = ${id};`);
}

export async function renderHomePage(req, res) {
    const pageTitle = "Home";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    const endpoint = '/';

    console.log('cookies', req.cookies);
    if(Object.entries(req.cookies).length > 0) {
        const [currentTableName, ...restOfTheArray] = Object.values(req.cookies);
        tableName = currentTableName;
        const dbData = await db.query(`SELECT * FROM ${currentTableName}`)
        res.render('index', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg})
    }
    else res.render('index', {pageTitle, endpoint, tableName, dbTables, errorMsg} );
}

export async function renderSelectedTable(req, res) {
    const pageTitle = "Home";
    const dbTables = await getTables();
    const endpoint = '/';

    let errorMsg = "";
    let tableName = "";
    let dbData=[];

    if (req.body.tableAsideBtn){
        let tableName = req.body.tableAsideBtn;
        let sql = `SELECT * FROM ${req.body.tableAsideBtn}`;
        dbData = await db.query(sql);
        res.cookie('currentTable', tableName, {maxAge: 900000, httpOnly: true});
        res.render('index', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});
    } else if (req.body.delRowBtn){
        const [tableName, id] = req.body.delRowBtn.split(",");
        deleteRow(tableName, id);
        let sql = `SELECT * FROM ${req.body.delRowBtn.split(",")[0]}`;
        dbData = await db.query(sql);
        res.render('index', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});
    } else {
        errorMsg = "Table name missing";
        dbData = [{}];
        res.render('index', {pageTitle, endpoint, tableName, dbData,dbTables, errorMsg});
    }
}

export async function renderUpdateDataPage(req, res) {
    const pageTitle = "Update Data";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    let endpoint = '/updateData';

    console.log('cookies', req.cookies);
    if(Object.entries(req.cookies).length > 0) {
        const [currentTableName, ...restOfTheArray] = Object.values(req.cookies);
        tableName = currentTableName;
        const dbData = await db.query(`SELECT * FROM ${currentTableName}`)
        res.render('updateData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg})
    }
    else {
        endpoint = '/';
        res.render('index', {pageTitle, endpoint, tableName, dbTables, errorMsg} );
    }
}

export async function updateData(req, res) {
    const pageTitle = "Update Data";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    let currentTable = '';
    let endpoint = '/updateData';

    if(Object.entries(req.cookies).length > 0) {
        const [currentTableName, ...restOfTheArray] = Object.values(req.cookies);
        currentTable = currentTableName;
        tableName = currentTableName;
    }
    else {
        endpoint = '/';
        res.render('index', {pageTitle, endpoint, tableName, dbTables, errorMsg} );
    }

    // Return to endpoint updateData after deleting row from table
    if(req.body.delRowBtn) {
        const [tableName, id] = req.body.delRowBtn.split(",");
        await deleteRow(tableName, id);
        let sql = `SELECT * FROM ${tableName}`;
        const dbData = await db.query(sql);
        res.render('updateData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});
        return;
    }

    const requestData = req.body;
    const keys = Object.keys(requestData);
    const values = Object.values(requestData);
    const keyValuesArr = keys.map((key, i) => {
        const value = typeof values[i] === 'string' ? `'${values[i]}'` : values[i];
        return `${key} = ${value}`
    });

    const filterEmptyStringsArr = keyValuesArr.filter(item => {
        const [field, value] = item.split('=').map(string => string.trim());
        return value !== "''";
    })
    console.log(filterEmptyStringsArr);

    const setClause = filterEmptyStringsArr.filter(requestData => !requestData.startsWith('id')).join(', ');
    const whereClause = filterEmptyStringsArr.filter(requestData => requestData.startsWith('id')).toString();

    const sqlUpdateQuery = `
        UPDATE ${currentTable}
        SET ${setClause}
        WHERE ${whereClause}
    `;
    console.log(sqlUpdateQuery);

    await db.query(sqlUpdateQuery, keyValuesArr);
    const dbData = await db.query(`SELECT * FROM ${currentTable}`);
    res.render('updateData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});

}

export async function renderCreateDataPage(req, res) {
    const pageTitle = "Create Data";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    let endpoint = '/createData'

    console.log('cookies', req.cookies);
    if(Object.entries(req.cookies).length > 0) {
        const [currentTableName, ...restOfTheArray] = Object.values(req.cookies);
        tableName = currentTableName;
        const dbData = await db.query(`SELECT * FROM ${currentTableName}`)
        res.render('createData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg})
    }
    else {
        endpoint = '/';
        res.render('index', {pageTitle, endpoint, tableName, dbTables, errorMsg} );
    }
}

export async function createData(req, res) {
    const pageTitle = "Create Data";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    let currentTable = '';
    let endpoint = '/createData';

    if(Object.entries(req.cookies).length > 0) {
        const [currentTableName, ...restOfTheArray] = Object.values(req.cookies);
        currentTable = currentTableName;
        tableName = currentTableName;
    }
    else {
        endpoint = '/';
        res.render('index', {pageTitle, endpoint, tableName, dbTables, errorMsg} );
    }

    // Return to endpoint createData after deleting row from table
    if(req.body.delRowBtn) {
        const [tableName, id] = req.body.delRowBtn.split(",");
        await deleteRow(tableName, id);
        let sql = `SELECT * FROM ${tableName}`;
        const dbData = await db.query(sql);
        res.render('createData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});
        return;
    }

    const requestData = req.body;
    const keys = Object.keys(requestData).join(', ');
    const values = Object.values(requestData).map((value) => {
        if(typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
        else return value;
    }).join(', ');

    const sqlCreateQuery = `
        INSERT INTO ${currentTable}
        (${keys})
        VALUES (${values});
    `;
    
    await db.query(sqlCreateQuery, keys, values);
    const dbData = await db.query(`SELECT * FROM ${currentTable}`);
    res.render('createData', {pageTitle, endpoint, tableName, dbData, dbTables, errorMsg});
}