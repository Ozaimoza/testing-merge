const express = require("express");
const router = require("./routes/index");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
