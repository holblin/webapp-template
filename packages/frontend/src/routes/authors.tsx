import { createFileRoute } from '@tanstack/react-router'
import { AuthorCountry, AuthorListSortBy, SortDirection } from 'src/__generated__/gql/graphql'
import { defaultAuthorPageSearch, type AuthorPageSearch, type AuthorSortBy } from 'src/features/authors/authorInventory'
import { parseBoolean, parseEnum, parseNumber, parsePositiveInt, parseString } from 'src/features/inventory/searchParams'
import { AuthorsPage } from 'src/pages/Authors/AuthorsPage'

export const Route = createFileRoute('/authors')({
  validateSearch: (search): AuthorPageSearch => ({
    offset: parsePositiveInt(search.offset, defaultAuthorPageSearch.offset),
    limit: parsePositiveInt(search.limit, defaultAuthorPageSearch.limit),
    search: parseString(search.search, defaultAuthorPageSearch.search),
    sortBy: parseEnum<AuthorSortBy>(search.sortBy, [AuthorListSortBy.Id, AuthorListSortBy.Name], defaultAuthorPageSearch.sortBy),
    sortDirection: parseEnum(search.sortDirection, [SortDirection.Asc, SortDirection.Desc], defaultAuthorPageSearch.sortDirection),
    filterNameContains: parseString(search.filterNameContains, defaultAuthorPageSearch.filterNameContains),
    filterCountry: parseEnum(search.filterCountry, [
      '',
      AuthorCountry.Us,
      AuthorCountry.Gb,
      AuthorCountry.Fr,
      AuthorCountry.De,
      AuthorCountry.Jp,
      AuthorCountry.Ca,
    ], defaultAuthorPageSearch.filterCountry),
    filterIsActive: parseEnum(search.filterIsActive, ['all', 'active', 'inactive'], defaultAuthorPageSearch.filterIsActive),
    filterBirthDateFrom: parseString(search.filterBirthDateFrom, defaultAuthorPageSearch.filterBirthDateFrom),
    filterBirthDateTo: parseString(search.filterBirthDateTo, defaultAuthorPageSearch.filterBirthDateTo),
    filterHasBookTagId: parseString(search.filterHasBookTagId, defaultAuthorPageSearch.filterHasBookTagId),
    filterHasBookGenre: parseString(search.filterHasBookGenre, defaultAuthorPageSearch.filterHasBookGenre),
    filterMinBookCount: parsePositiveInt(search.filterMinBookCount, defaultAuthorPageSearch.filterMinBookCount),
    filterPublishedAfterYear: parsePositiveInt(search.filterPublishedAfterYear, defaultAuthorPageSearch.filterPublishedAfterYear),
    filterMinAverageBookRating: parseNumber(search.filterMinAverageBookRating, defaultAuthorPageSearch.filterMinAverageBookRating),
    showFilters: parseBoolean(search.showFilters, defaultAuthorPageSearch.showFilters),
  }),
  component: AuthorsPage,
})
