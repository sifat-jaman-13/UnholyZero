import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "../..");
const quote = (value) => JSON.stringify(String(value));

export function renderPost(article, sources, runId) {
  return `---\ntitle: ${quote(article.title)}\ndescription: ${quote(article.description)}\npublishedAt: ${new Date().toISOString().slice(0, 10)}\ntags:\n${article.tags.map((tag) => `  - ${quote(tag)}`).join("\n")}\ndraft: false\nagentRunId: ${quote(runId)}\nsources:\n${sources.map((source) => `  - title: ${quote(source.title)}\n    url: ${quote(source.url)}`).join("\n")}\n---\n\n${article.body.trim()}\n`;
}

function run(command, args) { const result = spawnSync(command, args, { cwd: root, encoding: "utf8" }); if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout}`); }

export function writeAndOptionallyCreatePr(article, sources, slug, config) {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const file = resolve(root, "src/content/posts", `${slug}.md`);
  if (existsSync(file)) throw new Error(`Refusing to overwrite existing post: ${file}`);
  if (config.dryRun) return { file, runId, written: false };
  if (config.createPr) {
    const status = spawnSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" });
    if (status.stdout.trim()) throw new Error("Refusing PR creation: the working tree is not clean.");
  }
  writeFileSync(file, renderPost(article, sources, runId), "utf8");
  if (!config.createPr) return { file, runId, written: true };
  const branch = `agent/${slug}-${runId.slice(0, 10)}`;
  run("git", ["checkout", "-b", branch]); run("git", ["add", file]); run("git", ["commit", "-m", `Add draft: ${article.title}`]); run("git", ["push", "-u", "origin", branch]);
  run("gh", ["pr", "create", "--title", `Draft: ${article.title}`, "--body", "AI-assisted draft. Review facts, citations, and editorial quality before merging."]);
  return { file, runId, written: true, branch };
}
