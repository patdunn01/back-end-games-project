const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { app } = require("../app");
const db = require("../db/connection");
require("jest-sorted");

afterAll(() => {
  if (db.end) {
    return db.end();
  }
});
beforeEach(() => seed(testData));

describe("Standard error messages", () => {
  it("Returns a 404 error when given a bad request", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No such path found. Try again...");
      });
  });
});

describe("1. GET requests.", () => {
  test("sends back an array of games categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.category).toBeInstanceOf(Array);
        expect(body.category.length).toBeGreaterThan(0);
        const categoryArr = body.category;
        categoryArr.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("sends back an array of games reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeInstanceOf(Array);
        expect(body.review).toBeSorted("created_at", {
          descending: true,
        });
        expect(body.review.length).toBeGreaterThan(0);
        const reviewArr = body.review;
        reviewArr.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});

describe("Sepcific review request /api/reviews/:review_id", () => {
  test("sends back an object of a specific review request", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
          })
        );
      });
  });
});

describe("Sepcific comments request by review ID /api/reviews/:review_id/comments", () => {
  test("sends back an object of specific comments when requested with a review ID", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.comments;
        commentsArr.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("returns 200 status with message of no comments when valid review_id is provided but there are no comments", () => {
    return request(app)
      .get("/api/reviews/6/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("status 404 when bad request has been made", () => {
    return request(app)
      .get("/api/reviews/40/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No such path found. Try again...");
      });
  });
});
