---
title: "How HTTP Status Codes Should Guide Retry Decisions"
description: "A technical guide to using HTTP status code classes to decide when a request is safe to retry, when to back off, and when to stop entirely."
publishedAt: 2026-09-26
tags:
  - "HTTP"
  - "status codes"
  - "retry logic"
  - "resilience"
  - "client error handling"
draft: true
agentRunId: "2026-09-26T20-46-07-451Z"
sources:
  - title: "developer.mozilla.org"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status"
---

# How HTTP Status Codes Should Guide Retry Decisions

Every HTTP request ends with a status code, and that single number is the most reliable signal a client has about whether a retry is worthwhile. The five response classes defined by RFC 9110 [Source 1] map directly onto a decision tree: some codes mean "try again," some mean "wait and try again," and some mean "stop." Treating these classes as the backbone of retry logic prevents wasted requests, avoids hammering a failing server, and keeps clients from retrying requests that can never succeed.

## The five classes and what they imply for retries

The status codes are grouped into five classes, and each class carries a different implication for a client's next action [Source 1].

**Informational responses (100–199).** Codes like 100 Continue and 101 Switching Protocols are interim signals, not final answers. A 100 Continue tells the client to keep sending the request, so it is not an error and should never trigger a retry [Source 1]. 103 Early Hints lets the user agent begin preloading resources while the server prepares a response, again a non-terminal signal [Source 1]. Because these responses are not failures, retry logic should ignore them entirely.

**Successful responses (200–299).** These are the endpoint of a healthy request. 200 OK, 201 Created, 202 Accepted, 204 No Content, and 206 Partial Content all indicate the request was handled [Source 1]. A 202 Accepted response is noncommittal about the outcome, since HTTP has no way to send an asynchronous result back [Source 1], but it is still a success and should not be retried. When a response is in this class, the client should treat the request as complete and not retry.

**Redirection messages (300–399).** Redirects are a special case. 301 Moved Permanently and 308 Permanent Redirect point to a new URL permanently, and 302 Found indicates a temporary change [Source 1]. A client following a redirect is not retrying the same request; it is issuing a new request to a different URL, so redirects should be followed rather than retried. The permanent variants (301, 308) require the client to preserve the original method, while 307 Temporary Redirect and 308 Permanent Redirect both require the method to be preserved on the redirected request [Source 1]. None of these codes are failures, so they should not be treated as retry triggers.

**Client error responses (400–499).** This is where retry decisions become subtle. A 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, and 406 Not Acceptable all describe a request the server will not fulfill [Source 1]. These are almost never transient: the client's request is malformed, unauthorized, or points to a resource that does not exist. Retrying a 404 or a 403 will not help, because the problem is with the request, not with a temporary server condition. The one exception is 408 Request Timeout, which the RFC describes as a signal that the server would like to shut down an idle connection [Source 1]. A 408 is genuinely transient, so it is one of the few client errors worth retrying.

**Server error responses (500–599).** These are the codes that most clearly justify a retry. A 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, or 504 Gateway Timeout all indicate that the server itself is having trouble, not the client [Source 1]. When a server is overloaded or temporarily unavailable, waiting and retrying is often the correct action. 503 Service Unavailable is particularly important because it frequently carries a Retry-After header that tells the client how long to wait before trying again [Source 1].

## Why the class matters more than the specific code

The reason to anchor retry logic on the class rather than the exact code is that the class predicts the cause. A 4xx means the fault is on the client side and will persist across retries; a 5xx means the fault is on the server side and may clear on its own. Retrying a 4xx request wastes bandwidth and adds load to the very server that is already struggling, while failing fast on a 4xx lets the client correct its mistake—fixing malformed syntax, supplying credentials, or choosing a different method.

The distinction also protects against a common failure mode: retrying a request that can never succeed. A 401 Unauthorized will not be resolved by a retry, because the client still lacks valid credentials [Source 1]. A 403 Forbidden means the client's identity is known but access is denied [Source 1]. A 404 Not Found means the resource does not exist [Source 1]. In each case, the server's response is a definitive answer, and a retry only adds latency without changing the outcome.

## How to translate classes into concrete retry behavior

A practical retry policy can be built directly from the classes:

- **Do not retry 1xx and 2xx.** These are interim or successful responses, and retrying them either ignores a valid result or re-sends a request that already succeeded [Source 1].
- **Follow 3xx redirects instead of retrying.** Redirects change the URL, so the client issues a new request rather than repeating the failed one [Source 1]. Preserve the method on 307 and 308, and recognize that 301 and 302 may change a POST to a GET [Source 1].
- **Retry only 408 among the 4xx codes.** A 408 Request Timeout is transient because it signals the server wants to close an idle connection, so a short wait and a new request is appropriate [Source 1]. All other 4xx codes should fail fast.
- **Retry 5xx codes with backoff.** Server errors are the primary retry candidates. Use exponential backoff with jitter to space out retries, and honor any Retry-After header the server provides [Source 1]. 503 Service Unavailable is the clearest signal that the server is temporarily unavailable and that waiting will help [Source 1].

## The role of the Retry-After header

When a server returns a 503 or another 5xx, it may include a Retry-After header that specifies how long the client should wait before retrying [Source 1]. This header turns a guess into a precise instruction. A client that reads Retry-After and respects it will avoid the thundering-herd problem, where many clients retry simultaneously and overwhelm an already-struggling server. Ignoring the header and using a fixed backoff defeats the server's intent and can make a transient outage worse.

## Summary

HTTP status codes are not just labels; they are a decision framework. The five classes defined by RFC 9110 tell a client whether a request succeeded, whether it should be redirected, whether the client must fix something, or whether the server is failing [Source 1]. By mapping each class to a concrete action—ignore 1xx and 2xx, follow 3xx, fail fast on 4xx except 408, and back off on 5xx—clients can retry intelligently instead of blindly. The most resilient clients treat the status code as the source of truth and let it guide every retry decision.
