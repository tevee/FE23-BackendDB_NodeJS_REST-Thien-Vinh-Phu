import * as db from "../../db.js";

async function getTables(){
    const sql = 'SHOW tables';
    const dbTables = await db.query(sql);
    return dbTables
}

export async function renderHomePage(req, res) {
    const pageTitle = "Home";
    const dbTables = await getTables();
    let tableName = 'Select table';
    let errorMsg = '';
    res.render('index', {pageTitle, tableName, dbTables, errorMsg} );
}

export async function renderSelectedTable(req, res) {
    const pageTitle = "Home";
    console.log(req.body);
    const dbTables = await getTables();
    //remove row
    if(req.body.delRowBtn){
        await db.query(`DELETE FROM ${req.body.delRowBtn.split(",")[0]} WHERE id=${req.body.delRowBtn.split(",")[1]}`);
    }
    //show data
    let errorMsg = "";
    let tableName = "";
    let dbData=[];

    if (req.body.tableAsideBtn){
        let tableName = req.body.tableAsideBtn;
        let sql = `SELECT * FROM ${req.body.tableAsideBtn}`;
        dbData = await db.query(sql);
        res.render('index', {pageTitle,tableName, dbData, dbTables, errorMsg});
    } else if (req.body.delRowBtn){
        let tableName = req.body.delRowBtn.split(",")[0];
        let sql = `SELECT * FROM ${req.body.delRowBtn.split(",")[0]}`;
        dbData = await db.query(sql);
        res.render('index', {pageTitle,tableName, dbData, dbTables, errorMsg});
    } else {
        errorMsg = "Table name missing";
        dbData = [{}];
        res.render('index', {pageTitle,tableName, dbData,dbTables, errorMsg});
    }
}

