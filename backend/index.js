const express = require("express");
const dotenv = require("dotenv")
const getOtp = require("./routes/getOtp");
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/api/getOtp", getOtp);

app.listen(process.env.PORT || 8080, () => {
    console.log("Server Listening at port 8080");
})