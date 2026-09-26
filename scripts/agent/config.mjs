import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const truthy = (value) => String(value).toLowerCase() === "true";

function loadDotEnv() {
  const file = resolve(import.meta.dirname, "../../.env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

function csv(name, required = false) {
  const values = (process.env[name] || "").split(",").map((value) => value.trim()).filter(Boolean);
  if (required && !values.length) throw new Error(`${name} must be set.`);
  return values;
}

export function loadConfig() {
  loadDotEnv();
  const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
  const parsed = new URL(ollamaUrl);
  if (!["127.0.0.1", "localhost"].includes(parsed.hostname) || parsed.protocol !== "http:") {
    throw new Error("OLLAMA_URL must be http://127.0.0.1:11434 or http://localhost:11434.");
  }
  return {
    ollamaUrl: parsed.origin,
    model: process.env.OLLAMA_MODEL || "ornith-1.5:9b",
    topic: process.env.AGENT_TOPIC || "",
    sourceUrls: csv("AGENT_SOURCE_URLS", true),
    allowedDomains: csv("AGENT_ALLOWED_DOMAINS", true).map((domain) => domain.toLowerCase()),
    dryRun: process.env.AGENT_DRY_RUN === undefined ? true : truthy(process.env.AGENT_DRY_RUN),
    createPr: truthy(process.env.AGENT_CREATE_PR),
  };
}
