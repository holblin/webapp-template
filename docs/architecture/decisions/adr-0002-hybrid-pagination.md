# ADR-0002: Hybrid Cursor + Offset Pagination

## Status

Accepted

## Decision

Use offset-based slicing internally, exposed through:

- initial paging via `offset` + `limit`
- forward paging via opaque `after` cursor

When both are provided, `after` is authoritative.

## Rationale

- easy server implementation with in-memory API clients
- cursor-compatible client behavior for incremental loading
- allows deterministic page boundaries without schema churn
