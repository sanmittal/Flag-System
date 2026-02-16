import express from "express";
import featureRoutes from "./routes/routes";

const app = express();
app.use(express.json());
app.use("/features", featureRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
