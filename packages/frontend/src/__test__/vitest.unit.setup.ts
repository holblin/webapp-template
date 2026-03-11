import { afterAll, beforeAll } from 'vitest';

const REACT_UNKNOWN_PROP_WARNING = 'React does not recognize the `';
const REACT_FORMATTED_PROP_WARNING = 'React does not recognize the `%s` prop on a DOM element';
const REACT_UNKNOWN_PROP_WARNING_SUFFIX = '` prop on a DOM element';

const SUPPRESSED_S2_MOCK_PROPS = new Set([
  'isPending',
  'isRequired',
  'isDisabled',
  'sortDescriptor',
  'isRowHeader',
  'allowsSorting',
  'allowsResizing',
  'loadingState',
  'selectedKey',
  'isQuiet',
  'selectionMode',
  'selectionStyle',
  'minValue',
  'maxValue',
]);

const originalConsoleError = console.error.bind(console);

const extractUnknownPropName = (message: string) => {
  if (!message.includes(REACT_UNKNOWN_PROP_WARNING) || !message.includes(REACT_UNKNOWN_PROP_WARNING_SUFFIX)) {
    return null;
  }

  const match = message.match(/React does not recognize the `([^`]+)` prop on a DOM element/);
  return match?.[1] ?? null;
};

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const [message, ...details] = args;

    if (typeof message === 'string') {
      const propName = extractUnknownPropName(message);
      if (propName && SUPPRESSED_S2_MOCK_PROPS.has(propName)) {
        return;
      }

      if (
        message.includes(REACT_FORMATTED_PROP_WARNING)
        && typeof details[0] === 'string'
        && SUPPRESSED_S2_MOCK_PROPS.has(details[0])
      ) {
        return;
      }
    }

    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});
