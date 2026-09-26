import test from "node:test";
import assert from "node:assert/strict";
import { slugify, validateArticle } from "./gates.mjs";

const sources = [{ number: 1, title: "Documentation", url: "https://developer.mozilla.org/" }];
const body = `${"Useful technical guidance ".repeat(250)}[Source 1]`;
test("creates stable slugs", () => assert.equal(slugify("HTTP Retries: A Practical Guide!"), "http-retries-a-practical-guide"));
test("accepts a cited article within the word limit", () => assert.deepEqual(validateArticle({ title: "How HTTP retries work in practice", description: "A practical explanation of safe retry decisions for reliable clients.", tags: ["http", "reliability"], body }, sources).errors, []));
test("rejects missing and invalid citations", () => assert.match(validateArticle({ title: "How HTTP retries work in practice", description: "A practical explanation of safe retry decisions for reliable clients.", tags: ["http", "reliability"], body: body.replace("[Source 1]", "[Source 2]") }, sources).errors.join(" "), /unfetched source/));
