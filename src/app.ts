import {main} from "./test";
import {myPage} from "./lib/MyPage";
import {loadSetting, pidIsRunning} from "./lib/helper";
import GoogleSheets from "./sheets/GoogleSheets";

var express = require('express');

var app = express();

app.get("/", async function (req: any, res: any) {
    new GoogleSheets()
    res.send("Start ...")
})

app.get("/exit", async function (req: any, res: any) {
    let jsonSetting = await loadSetting()
    pidIsRunning(jsonSetting["pid"])
    res.send("Exit Process!")
})

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
})