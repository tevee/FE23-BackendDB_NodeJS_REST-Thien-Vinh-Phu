import { Router } from "express";
import * as page from "./requestHandlers/viewsReqHandlers.js";

const viewRouter = Router();

viewRouter.route("/").get(page.renderHomePage).post(page.renderSelectedTable);
viewRouter.route("/update").post(page.renderSelectedTable);

export {viewRouter}