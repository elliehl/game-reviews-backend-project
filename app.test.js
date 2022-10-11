const request = require("supertest");
const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");

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
// need to do tests for if inc_votes' value is a string (400), not a number, as well as if there is no inc_votes key on the object at all (200) - try to patch with an empty object to see what happens
