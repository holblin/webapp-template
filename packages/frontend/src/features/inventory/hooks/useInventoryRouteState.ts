export type InventoryRouteApi<TSearch> = {
  useSearch: () => TSearch;
  useNavigate: () => (options: { search: TSearch; replace?: boolean }) => void;
};

export const useInventoryRouteState = <TSearch>(routeApi: InventoryRouteApi<TSearch>) => {
  const searchState = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const onStateChange = (nextState: TSearch) => {
    navigate({ search: nextState, replace: true });
  };

  return {
    searchState,
    onStateChange,
  };
};
