const HEX_COLOR_PATTERN = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

function containsHexColor(value) {
  return HEX_COLOR_PATTERN.test(value);
}

function reportIfHardcodedHexColor(context, node, value) {
  if (!containsHexColor(value)) {
    return;
  }

  context.report({
    node,
    message:
      "Avoid hardcoded color values like '{{ color }}'. Use React Spectrum S2 tokens with the @react-spectrum/s2 style() macro.",
    data: {
      color: value.match(HEX_COLOR_PATTERN)?.[0] ?? value,
    },
  });
}

const noHardcodedColorsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow hardcoded hex color values and require React Spectrum S2 design tokens.",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }

        reportIfHardcodedHexColor(context, node, node.value);
      },
      TemplateElement(node) {
        const text = node.value?.raw;
        if (typeof text !== "string") {
          return;
        }

        reportIfHardcodedHexColor(context, node, text);
      },
    };
  },
};

function unwrapExpression(node) {
  let current = node;
  while (
    current
    && (
      current.type === "TSAsExpression"
      || current.type === "TSTypeAssertion"
      || current.type === "TSNonNullExpression"
      || current.type === "TSSatisfiesExpression"
      || current.type === "ParenthesizedExpression"
    )
  ) {
    current = current.expression;
  }

  return current;
}

const styleMacroInlineObjectRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require @react-spectrum/s2 style() macro calls to use inline object literals and disallow assigning style() results to variables.",
    },
    schema: [],
  },
  create(context) {
    const styleMacroLocalNames = new Set();

    return {
      ImportDeclaration(node) {
        if (node.source?.value !== "@react-spectrum/s2/style") {
          return;
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier"
            && specifier.imported?.type === "Identifier"
            && specifier.imported.name === "style"
          ) {
            styleMacroLocalNames.add(specifier.local.name);
          }
        }
      },
      CallExpression(node) {
        if (
          node.callee.type !== "Identifier"
          || !styleMacroLocalNames.has(node.callee.name)
        ) {
          return;
        }

        if (
          node.parent?.type === "VariableDeclarator"
          && node.parent.init === node
        ) {
          context.report({
            node,
            message:
              "Do not assign style() results to variables. Inline style() directly in JSX props.",
          });
        }

        const firstArg = node.arguments[0];
        const unwrappedArg = firstArg ? unwrapExpression(firstArg) : null;

        if (!unwrappedArg || unwrappedArg.type !== "ObjectExpression") {
          context.report({
            node,
            message:
              "style() must receive an inline object literal (for example: style({ display: 'flex' })).",
          });
        }
      },
    };
  },
};

export default {
  rules: {
    "no-hardcoded-colors": noHardcodedColorsRule,
    "style-macro-inline-object": styleMacroInlineObjectRule,
  },
};
