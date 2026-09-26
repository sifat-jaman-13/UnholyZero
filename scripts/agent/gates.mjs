const unsafe = /\b(ignore (all|previous) instructions|system prompt|<script|javascript:|guaranteed (income|ranking)|buy now)\b/i;
const promo = /\b(best deal|limited time|act now|click here|affiliate link)\b/i;

export function slugify(title) {
  return title.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

export function validateArticle(article, sources) {
  const errors = [];
  if (!article || typeof article !== "object") errors.push("Article is missing.");
  const { title, description, tags, body } = article || {};
  if (typeof title !== "string" || title.trim().length < 12) errors.push("Title is missing or too short.");
  if (typeof description !== "string" || description.trim().length < 30) errors.push("Description is missing or too short.");
  if (!Array.isArray(tags) || tags.length < 2 || tags.length > 5 || tags.some((tag) => typeof tag !== "string" || !tag.trim())) errors.push("Tags must contain 2-5 strings.");
  if (typeof body !== "string") errors.push("Body is missing.");
  const words = typeof body === "string" ? body.trim().split(/\s+/).filter(Boolean).length : 0;
  if (words < 500 || words > 1400) errors.push("Body must be 500-1400 words.");
  if (unsafe.test(`${title || ""} ${description || ""} ${body || ""}`)) errors.push("Unsafe content detected.");
  if (promo.test(`${title || ""} ${description || ""} ${body || ""}`)) errors.push("Promotional language detected.");
  const citations = [...String(body || "").matchAll(/\[Source (\d+)\]/g)].map((match) => Number(match[1]));
  if (!citations.length) errors.push("At least one inline source citation is required.");
  if (citations.some((number) => !sources.some((source) => source.number === number))) errors.push("Citation refers to an unfetched source.");
  const slug = slugify(title || "");
  if (!slug) errors.push("Unable to create a stable slug.");
  return { errors, slug, words };
}
