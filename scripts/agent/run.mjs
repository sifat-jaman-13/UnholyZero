import { loadConfig } from "./config.mjs";
import { fetchSources } from "./research.mjs";
import { draftArticle } from "./ollama.mjs";
import { validateArticle } from "./gates.mjs";
import { writeAndOptionallyCreatePr } from "./publish.mjs";

const config = loadConfig();
const sources = await fetchSources(config.sourceUrls, config.allowedDomains);
const article = await draftArticle(config, sources);
const result = validateArticle(article, sources);
if (result.errors.length) throw new Error(`Article rejected:\n- ${result.errors.join("\n- ")}`);
const output = writeAndOptionallyCreatePr(article, sources, result.slug, config);
console.log(JSON.stringify({ ...output, slug: result.slug, words: result.words, sourceCount: sources.length, dryRun: config.dryRun }, null, 2));
