import request from "supertest";
import app from "../src/app.js";
import { describe, it } from "vitest";

describe("GET /", () => {
    it("responds with a json message", () => {
        return request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200, {
                status: "healty"
            });
    });
});