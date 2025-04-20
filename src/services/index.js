import { db } from "../mongo";
const REVIEWS_COLLECTION = "reviews";
const QUERIES_COLLECTION = "queries";

export const searchReviewsbyPlate = async (plate) => {
  if (!plate) {
    console.error("Error: Se requiere la matrícula (plate) para buscar.");
    return null;
  }

  try {
    const query = { plate: plate };
    const options = {
      projection: { _id: 0, type: 1, description: 1, plate: 1, number: 0 },
    };

    const collection = await db.collection(REVIEWS_COLLECTION) 
    const review = await collection
      .findOne(query, options);

    console.log(review);
    return review;
  } catch (error) {
    console.error(`Error buscando reseña por matrícula '${plate}':`, error);
    return null;
  }
};

export const saveReview = async ({ number, type, description, plate }) => {
  if (!number || !type || !description || !plate) {
    console.error("Error: Faltan datos para guardar la reseña.");
    return null;
  }

  const doc = {
    number,
    type,
    description,
    plate,
    createdAt: new Date(),
  };
  try {

    let collection = await db.collection(REVIEWS_COLLECTION);
      
    const savedReview = await collection
      .insertOne(doc);
    return savedReview;
  } catch (error) {
    console.error("Error guardando la reseña:", error);
    return null;
  }
};

export const saveQuery = async ({ number, plate }) => {
  if (!number || !plate) {
    console.error("Error: Faltan datos para guardar la consulta (query).");
    return null;
  }

  const doc = {
    number,
    plate,
    queriedAt: new Date(),
  };

  try {
    const result = await mongoClient
      .collection(QUERIES_COLLECTION)
      .insertOne(doc);

    console.log(`Consulta guardada con éxito con ID: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error("Error guardando la consulta (query):", error);
    return null;
  }
};
