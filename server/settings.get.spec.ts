import { describe, it, expect } from "vitest";
import { setup, fetch } from '@nuxt/test-utils'

describe("GET /api/settings", async () => {

    await setup({
        browser: false,
    })

    it("should respond with status code 200", async () => {
        const response: Response = await fetch('/api/settings');
        expect(response.status).toBe(200)
    });


    it("should return a JSON object", async () => {
        const response: Response = await fetch('/api/settings');
        const body = await response.json();
        expect(body).toEqual({ foo: 'bar' })
    });
});
