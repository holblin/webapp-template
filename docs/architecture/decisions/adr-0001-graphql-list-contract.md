# ADR-0001: GraphQL List Contract

## Status

Accepted

## Decision

All domain list queries must use a connection-style response and common list args:

- response: `edges`, `nodes`, `pageInfo`, `totalCount`
- args: `offset`, `limit`, `after`, `search`, `sort`, `filter`

## Rationale

- enables consistent frontend data handling
- supports Apollo pagination patterns cleanly
- keeps list APIs uniform across modules
