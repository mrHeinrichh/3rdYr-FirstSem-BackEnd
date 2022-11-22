const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const operatorRoutes = require("./routes/operator");

require("dotenv").config();

var api = process.env.API_URL;

const app = express();
app.use(express.json());
app.use(cors());
app.use(`${api}/operator`, operatorRoutes);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
