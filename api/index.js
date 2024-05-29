const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.error(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const paymentRoute = require("./routes/subscription"); 
const roleRoute = require("./routes/role"); 
const seriousRoute = require("./routes/serious"); 
const recommendationRouter = require("./routes/recommendation"); 

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api/payment", paymentRoute); 
app.use("/api/role", roleRoute); 
app.use("/api/serious", seriousRoute); 
app.use('/api/recommendation', recommendationRouter);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get("/", (req, res) => {
  res.send("Hello Ethio Movie!");
});
// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log("Backend server is running on port", PORT);
});
