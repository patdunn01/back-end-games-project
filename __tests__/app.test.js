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

describe("3. POST requests.", () => {
  test("status 201 adds a new comment object to the comments table and returns the added object", () => {
    const newComment = {
      user_name: "mallionaire",
      body: "What a game!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "What a game!",
            review_id: 4,
            author: "mallionaire",
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status 404 when given an invalid user_name property", () => {
    const newComment = {
      user_name: "board_gamer_90",
      body: "unwanted comment",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request. Try again...");
      });
  });
  test("status 404 when given a review_id property that doesn't exist", () => {
    const newComment = {
      user_name: "mallionaire",
      body: "unwanted comment",
    };
    return request(app)
      .post("/api/reviews/30/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request. Try again...");
      });
  });
  test("status 400 when given an empty object body", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please input all fields");
      });
  });
  test("status 400 when given an invalid reviewId", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/three/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid review ID");
      });
  });
});

// describe('UPDATE requests.', () => {
//   test("status ")
// })