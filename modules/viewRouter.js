import { Router } from "express";
import * as page from "./requestHandlers/viewsReqHandlers.js";

const viewRouter = Router();

viewRouter.route("/").get(page.renderHomePage).post(page.renderSelectedTable);
viewRouter.route("/updateData").get(page.renderUpdateDataPage).post(page.updateData);
viewRouter.route("/createData").get(page.renderCreateDataPage).post(page.createData);

export {viewRouter}