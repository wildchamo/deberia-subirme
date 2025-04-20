import express from "express";
import 'dotenv/config'
import { searchReviewsbyPlate } from "./services/index.js"; 


const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello, Debería subirme!");
});

app.get("/reviews/:plate", async(req, res) => {

  const { plate } = req.params;

  console.log(plate)
  const review = await searchReviewsbyPlate(plate);
  if (!review) {
    return res.status(404).send("Reseña no encontrada");
  }
  res.send(review);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
