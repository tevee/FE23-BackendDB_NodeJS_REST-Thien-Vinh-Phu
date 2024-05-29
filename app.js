import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./modules/apiRouter.js";
import { viewRouter } from "./modules/viewRouter.js";

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", apiRouter);
app.use("/", viewRouter);

//server configuration
const port = 3000;
app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}/`);
});