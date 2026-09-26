function allowed(hostname, domains) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export async function fetchSources(urls, allowedDomains) {
  return Promise.all(urls.map(async (rawUrl, index) => {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || !allowed(url.hostname.toLowerCase(), allowedDomains)) {
      throw new Error(`Source ${rawUrl} is not an approved HTTPS source.`);
    }
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000), headers: { "User-Agent": "UnholyZeroResearch/1.0" } });
    if (!response.ok) throw new Error(`Source ${url} returned ${response.status}.`);
    const finalUrl = new URL(response.url);
    if (finalUrl.protocol !== "https:" || !allowed(finalUrl.hostname.toLowerCase(), allowedDomains)) throw new Error(`Source redirected outside the approved domains.`);
    const html = await response.text();
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 10_000);
    return { number: index + 1, title: response.headers.get("title") || finalUrl.hostname, url: finalUrl.href, text };
  }));
}
