import express from "express";
import 'dotenv/config'
import { searchReviewsbyPlate,saveReview,saveQuery } from "./services/index.js"; 


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello, Debería subirme!");
});

app.get("/reviews/:plate", async(req, res) => {

  const { plate } = req.params;

  const review = await searchReviewsbyPlate(plate.toUpperCase());
  if (!review) {
    return res.status(404).send("Reseña no encontrada");
  }
  res.status(201).send(review);
});



app.post("/reviews", async(req, res) => {
  const { number, type, description, plate } = req.body;

  const savedReview = await saveReview({ number, type, description, plate: plate.toUpperCase() });

  if (!savedReview) {
    return res.status(500).send("Error al guardar la reseña");
  }


  res.status(201).send(savedReview); 
});



app.post("/queries", async(req, res) => {

  const { number, plate } = req.body;

  console.log(number, plate)

  const savedReview = await saveQuery({ number, plate: plate.toUpperCase() });

  if (!savedReview) {
    return res.status(500).send("Error el request reseña");
  }

  res.status(201).send(savedReview); 
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
