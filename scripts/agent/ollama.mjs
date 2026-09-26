export async function draftArticle(config, sources) {
  if (!config.topic.trim()) throw new Error("AGENT_TOPIC must be set.");
  const research = sources.map((source) => `SOURCE ${source.number}: ${source.url}\n${source.text}`).join("\n\n");
  const prompt = `Write an accurate, helpful technical article about: ${config.topic}\n\nUse only the provided sources. Return JSON only, with title, description, tags (array of 2-5 strings), and body (Markdown). Body must be 500-1400 words, use clear H2 sections, and cite factual claims inline as [Source 1], [Source 2], etc. Never invent facts, links, products, or citations. Do not use marketing language or calls to buy anything.\n\n${research}`;
  const response = await fetch(`${config.ollamaUrl}/api/generate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: config.model, prompt, stream: false, format: "json", options: { temperature: 0.2, num_ctx: 8192, num_predict: 1800 } }),
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}. Is ${config.model} installed and Ollama running locally?`);
  const payload = await response.json();
  try { return JSON.parse(payload.response); } catch { throw new Error("Ollama did not return valid article JSON."); }
}
