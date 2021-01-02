const { createServer } = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const normalizePort = (port) => parseInt(port, 10);

const PORT = normalizePort(process.env.PORT || 8000);

//express app
const app = express();
const dev = app.get("env") !== "production";
if (!dev) {
  app.disable("x-powered-by");
  app.use(compression());
  app.use(morgan("common"));
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, "build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

if (dev) {
  app.use(morgan("dev"));
}

// Redirects
app.post("/contact-us", (req, res) => {
  console.log(req.body);
  let data = `Time: ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getUTCFullYear()} | Name: ${
    req.body.name
  } | Email: ${req.body.email} | Message: ${req.body.message} \n`;
  fs.appendFileSync("./contact_us.txt", data, (err) => {
    if (err) throw err;
  });
  res.redirect("/home");
});

const server = createServer(app);

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
