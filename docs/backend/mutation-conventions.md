# Mutation Conventions

## CRUD Required For Each Domain

Every domain module should define:

- `<domain>Create`
- `<domain>Update`
- `<domain>Delete`

With matching SDL inputs and response types.

## Response Shape

Mutation responses follow:

- `code: String!`
- `success: Boolean!`
- `message: String!`
- optional entity field for create/update

## Validation Rules

Typical validation includes:

- required string fields must not be empty after trim
- uniqueness checks where names are unique (author/tag)
- existence checks for referenced records

## Relationship Integrity Rules

Current project behavior:

- deleting an author fails when books still reference that author
- deleting a book removes book references from tag `bookIds`
- tag create/update validates all referenced books exist
