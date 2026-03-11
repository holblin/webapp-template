# ADR-0004: Module CRUD Consistency

## Status

Accepted

## Decision

All domain modules must expose full CRUD:

- create
- update
- delete
- list (connection contract)

## Rationale

- predictable API surface across domains
- easier frontend and testing conventions
- reduces one-off resolver behavior

## Integrity Rules

Mutations must preserve cross-domain integrity. Current examples:

- block author deletion when books still reference author
- remove deleted books from tag mappings
