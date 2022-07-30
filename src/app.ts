import {main} from "./test";
import {myPage} from "./lib/MyPage";
import {loadSetting, pidIsRunning} from "./lib/helper";
import GoogleSheets from "./sheets/GoogleSheets";
import sleep from "./utils/sleep";

var express = require('express');

var app = express();

app.get("/", async function (req: any, res: any) {
    let sheet = new GoogleSheets()
    res.send("Start ...")
})

app.get("/exit", async function (req: any, res: any) {
    let jsonSetting = await loadSetting()
    pidIsRunning(jsonSetting["pid"])
    res.send("Exit Process!")
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

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
})