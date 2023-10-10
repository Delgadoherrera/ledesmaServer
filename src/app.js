const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const productsApi = require("./api/productsApi");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use("/", productsApi);

const PORT = 3004;

app.listen(PORT, () => {
  console.log("servidor ON sen puerto: ", PORT);
});
