export type InventoryRouteApi<TSearch> = {
  useSearch: () => TSearch;
  useNavigate: () => (options: { search: TSearch; replace?: boolean }) => void;
};

const removeDefaultSearchValues = <TSearch extends Record<string, unknown>>(
  state: TSearch,
  defaultState: TSearch,
): Partial<TSearch> => (
  Object.fromEntries(
    Object.entries(state).filter(([key, value]) => !Object.is(value, defaultState[key as keyof TSearch])),
  ) as Partial<TSearch>
);

export const useInventoryRouteState = <TSearch extends Record<string, unknown>>(
  routeApi: InventoryRouteApi<TSearch>,
  defaultSearchState: TSearch,
) => {
  const searchState = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const onStateChange = (nextState: TSearch) => {
    const hasChanged = Object.keys(nextState).some((key) => (
      !Object.is(
        nextState[key as keyof TSearch],
        searchState[key as keyof TSearch],
      )
    ));
    if (!hasChanged) {
      return;
    }

    navigate({
      search: removeDefaultSearchValues(nextState, defaultSearchState) as TSearch,
      replace: true,
    });
  };

  return {
    searchState,
    onStateChange,
  };
};
