import { mongoClient } from "../mongo";

export const searchReviewsbyPlate = async (plate) => {
  try {
    const query = { plate: plate };
    const options = {
      projection: { type: 1, description: 1, plate: 1 },
    };

    const review = await mongoClient
      .collection("reviews")
      .findOne(query, options);

    console.log(review);
    return review;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveReview = async ({ number, type, description, plate }) => {};

export const saveQuery = async ({ number, plate }) => {};
