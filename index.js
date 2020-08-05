const port = process.env.port || 5000;
const express = require("express");
const path = require("path");
const app = express();
const cp = require("child_process");
const server = require("http").createServer(app);
const fs = require("fs");

var types = JSON.parse(fs.readFileSync("types.json", "utf-8"));

//Pass json in fetch()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/f/", (req, res) => {
  //Send file
  res.sendFile(
    path
      .resolve("C:\\" + decodeURI(req.url).replace(/\//g, "\\"))
      .replace(/"/g, "")
  );
});

function getType(str) {
  for (const key in types) {
    if (types[key].findIndex((f) => str.includes(f)) > -1) return key;
  }
  return;
}
function get(res) {
  /*
  Send Different types of html by type of file
  if is folder send list of files folder
  */
  switch (getType()) {
    case "video":
      res.sendFile(path.resolve("public/type/video.html"));
      break;
    //To do: place others types
    default:
      res.sendFile(path.resolve("public/folder.html"));
      break;
  }
}
function post(req, res) {
  //return list with files in Folder
  let location = String(req.body.l).substr(1, String(req.body.l).length);
  location = location.replace(/\//g, "\\");
  location = decodeURI(location);
  console.log(location);
  switch (req.body.type) {
    case "index":
      let a = cp.exec("dir /b " + location);
      let result = [];
      a.stdout.on("data", (chunk) => {
        String(chunk)
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

app.use("/", async (req, res) => {
  if (req.method == "GET") get(req, res);
  else if (req.method == "POST") post(req, res);
});

server.listen(port, () => {
  console.log("Server is port: " + port);
});
