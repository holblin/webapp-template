type ConnectionPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

type ConnectionResult<TNode> = {
  edges: Array<{ cursor: string; node: TNode }>;
  nodes: TNode[];
  pageInfo: ConnectionPageInfo;
  totalCount: number;
};

type BuildConnectionInput<TNode> = {
  items: TNode[];
  offset?: number | null;
  limit?: number | null;
  after?: string | null;
};

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const CURSOR_PREFIX = 'offset:';

const normalizeOffset = (offset?: number | null): number => {
  if (offset === undefined || offset === null || Number.isNaN(offset)) {
    return DEFAULT_OFFSET;
  }

  return Math.max(0, Math.trunc(offset));
};

const normalizeLimit = (limit?: number | null): number => {
  if (limit === undefined || limit === null || Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }

  return Math.max(1, Math.min(MAX_LIMIT, Math.trunc(limit)));
};

const encodeCursor = (offset: number): string => (
  Buffer.from(`${CURSOR_PREFIX}${offset}`, 'utf8').toString('base64')
);

const decodeCursor = (cursor?: string | null): number | null => {
  if (!cursor) {
    return null;
  }

  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    if (!decoded.startsWith(CURSOR_PREFIX)) {
      return null;
    }

    const offset = Number.parseInt(decoded.slice(CURSOR_PREFIX.length), 10);
    if (Number.isNaN(offset) || offset < 0) {
      return null;
    }

    return offset;
  } catch {
    return null;
  }
};

export const buildConnection = <TNode>({
  items,
  offset,
  limit,
  after,
}: BuildConnectionInput<TNode>): ConnectionResult<TNode> => {
  const normalizedOffset = normalizeOffset(offset);
  const normalizedLimit = normalizeLimit(limit);
  const cursorOffset = decodeCursor(after);
  const startOffset = cursorOffset === null ? normalizedOffset : cursorOffset + 1;
  const pageItems = items.slice(startOffset, startOffset + normalizedLimit);

  const edges = pageItems.map((node, index) => ({
    cursor: encodeCursor(startOffset + index),
    node,
  }));

  return {
    edges,
    nodes: pageItems,
    totalCount: items.length,
    pageInfo: {
      hasNextPage: startOffset + pageItems.length < items.length,
      hasPreviousPage: startOffset > 0,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges.at(-1)?.cursor ?? null,
    },
  };
};
