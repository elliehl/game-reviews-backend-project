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
