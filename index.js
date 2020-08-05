const port=process.env.port|| 3000
const express = require("express");
const path = require("path");
const app = express();
const cp = require("child_process");
const server = require("http").createServer(app);
const fs = require("fs");

var type = JSON.parse(fs.readFileSync("types.json", "utf-8"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("static"));

app.use("/f/", (req, res) => {
  res.sendFile(
    path
      .resolve("C:\\" + decodeURI(req.url).replace(/\//g, "\\"))
      .replace(/"/g, "")
  );
});

app.use("/", async (req, res) => {
  if (req.method == "GET") {
    if (type.video.findIndex((f) => req.url.includes(f)) != -1) {
      res.sendFile(path.resolve("static/type/video.html"));
    } else {
      res.sendFile(path.resolve("index.html"));
    }
  } else {
    console.log(req.body.type);
    console.log(req.body);
    let location =
      String(req.body.e) +
      String(req.body.l).substr(1, String(req.body.l).length);
    location = location.replace(/\//g, "\\");
    location = decodeURI(location);
    console.log(location);
    switch (req.body.type) {
      case "index":
        let a = cp.exec("dir /b " + location);
        let result = [];
        a.stdout.on("data", (chunck) => {
          String(chunck)
            .split("\n")
            .forEach((f) => {
              result.push(f);
            });
        });
        a.stdout.on("close", () => {
          result = result.filter((f) => f != "");
          res.send(JSON.stringify(result));
        });
        break;
      case "video":
        break;
      default:
        res.status("404");
        break;
    }
  }
});

server.listen(port, () => {
  console.log("Server is port: "+ port);
});
