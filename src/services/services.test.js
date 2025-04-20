import {searchReviewsbyPlate, saveReview, saveQuery} from './services.js';

describe('searchReviewsbyPlate', () => {
  test("case searchReviewsbyPlate", async() => {
    const plate = "ABC-123";
    const review = await searchReviewsbyPlate(plate);
    console.log(review);
    expect(review).toBeDefined();
  });
})