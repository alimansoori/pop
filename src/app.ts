import express from "express";
import GoogleSheets from "./sheets/GoogleSheets";
import path from "path";
import expressLayouts from "express-ejs-layouts"
import dotenv from "dotenv"
import * as routes from './routes'
import {database} from "./lib/config/database";

dotenv.config()

const app = express();

// setup layouts
app.use(expressLayouts)
app.set('layout', 'layouts/layout');
// setting view engin
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

routes.register(app)

app.get("/", async function (req: any, res: any) {
    res.render("index")
})

app.get("/start", async function (req: any, res: any) {
    const sheet = new GoogleSheets()
    res.send("Start ...")
})

app.get("/reboot", (req: any, res: any)=> {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
})

app.listen(process.env.PORT, async () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
    try {
        await database.authenticate();
        console.log('Connection has been established successfully.');
        try {
            await database.sync({force: true})
        } catch (e: any) {
            console.log(e.message)
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})