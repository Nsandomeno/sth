import request from "supertest";
import app from "../src/app.js";
import { describe, it } from "vitest";

describe("#app", () => {
    it("responds with a not found message", () => {
        return request(app)
            .get("/fake-route")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(404)
    })
});