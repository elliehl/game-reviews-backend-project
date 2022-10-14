const request = require("supertest");
const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");
const { fetchReviews } = require("./reviews/model");
require("jest-sorted");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("app", () => {
  it("Responds with a 404 status and an error message when a non-existent endpoint is requested", () => {
    return request(app)
      .get("/api/fake_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
});

describe("GET /api/categories", () => {
  it("Responds with a 200 status and an array of category objects, containing slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("Responds with a 200 status and a single review object, matching the input id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            review_id: 3,
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          })
        );
      });
  });
  it("Responds with a 200 status and contains a count of the number of comments for each review", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            comment_count: 3,
          })
        );
      });
  });
  it("Responds with a 404 status and an error message when a non-existent review_id is requested", () => {
    return request(app)
      .get("/api/reviews/10000000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  it("Responds with a 400 status and an error message when an incorrect data type is input", () => {
    return request(app)
      .get("/api/reviews/name")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  it("Responds with a 200 status and an array of user objects, containing username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const newVotesObj = { inc_votes: 20 };
  it("Responds with a 200 status and an object of the updated version of the input review", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send(newVotesObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          review_id: 3,
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 25,
        });
      });
  });
  it("Responds with a 404 status and an error message when a non-existent review_id is attempted to be patched", () => {
    return request(app)
      .patch("/api/reviews/10000000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  it("Responds with a 400 status and an error message when an incorrect data type is input for the review_id", () => {
    return request(app)
      .patch("/api/reviews/name")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  it("Responds with a 400 status and an error message when an incorrect data type is input on the inc_votes key", () => {
    const newVotesObj = { inc_votes: "three" };
    return request(app)
      .patch("/api/reviews/3")
      .send(newVotesObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("This input should be a number");
      });
  });
  it("Responds with a 200 status and an unchanged object of the input review when the key name inc_votes is missing or typed incorrectly", () => {
    const newVotesObj = { inc_votesss: 20 };
    return request(app)
      .patch("/api/reviews/3")
      .send(newVotesObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          review_id: 3,
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
});

describe("GET /api/reviews", () => {
  it("Responds with a 200 status and an array of review objects, containing owner, title, review_id, category, review_img_url, created_at, votes, designer and comment_count properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("Is sorted by created_at in descending order, starting with the most recent review", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("Is sorted by votes in ascending order, starting with the lowest number of votes, when queried with these arguments", () => {
    return request(app)
      .get("/api/reviews?order=asc&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", { descending: false });
      });
  });
  it("Can be filtered by category, showing only the reviews of the input category", () => {
    return request(app)
      .get("/api/reviews?category=euro+game")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([
          {
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_id: 1,
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
            comment_count: 0,
          },
        ]);
      });
  });
  it("Returns a 404 status error when given a category that doesn't exist", () => {
    return request(app)
      .get("/api/reviews?category=legacy")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("This category does not exist");
      });
  });
  it("Returns a 404 status error when attempting to sort by a key that doesn't exist", () => {
    return request(app)
      .get("/api/reviews?sort_by=rating")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Cannot sort by this input");
      });
  });
  it("Returns a 404 status error when attempting to order by anything other than asc or desc", () => {
    return request(app)
      .get("/api/reviews?order=highest")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Can only order by asc or desc");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("Responds with a 200 status and an array of objects of all of the comments for the input review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              review_id: 3,
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              comment_id: expect.any(Number),
            })
          );
        });
      });
  });
  it("Is sorted by created_at in descending order, starting with the most recent comment", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("Returns a 404 status error when given a review_id that doesn't exist", () => {
    return request(app)
      .get("/api/reviews/10000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  it("Returns a 200 status and an empty array when given a valid review_id that doesn't have any comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("Responds with a 400 status and an error message when an incorrect data type is input for review_id", () => {
    return request(app)
      .get("/api/reviews/three/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const addedComment = {
    username: "dav3rid",
    body: "One of my favourite games!",
  };
  it("Responds with a 201 status and the new comment object", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send(addedComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            review_id: 3,
            author: "dav3rid",
            body: "One of my favourite games!",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  it("Returns a 404 status error when given a review_id that doesn't exist", () => {
    return request(app)
      .post("/api/reviews/10000/comments")
      .send(addedComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  it("Responds with a 400 status and an error message when an incorrect data type is input for review_id", () => {
    return request(app)
      .post("/api/reviews/three/comments")
      .send(addedComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  it("Responds with a 400 status and an error message when an empty object is passed as an added comment", () => {
    const addedComment = {};
    return request(app)
      .post("/api/reviews/3/comments")
      .send(addedComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Missing required field");
      });
  });
  it("Responds with a 404 status and an error message when the input is an invalid username", () => {
    const addedComment = {
      username: "werewolfstan",
      body: "One of my favourite games!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(addedComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid username");
      });
  });
});
