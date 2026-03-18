import { ButtonGroup, Divider, LinkButton } from '@react-spectrum/s2'
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

export const HomePage = () => {
  return (
    <main
      className={style({
        width: 'full',
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 24,
        maxWidth: 1100,
        marginX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      })}
    >
      <section
        className={style({
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'gray-300',
          borderRadius: 'xl',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          backgroundColor: 'gray-50',
        })}
      >
        <p className={style({ marginY: 0, font: 'body-sm', color: 'gray-700' })}>
          React + React Spectrum + GraphQL template
        </p>
        <h1 className={style({ marginY: 0, font: 'heading-xl' })}>
          Build production-ready web apps faster
        </h1>
        <p className={style({ marginY: 0, font: 'body-lg', color: 'gray-800' })}>
          This starter includes a React frontend with Spectrum S2 UI components, a GraphQL backend,
          code generation, inventory CRUD examples, and testing tooling so you can focus on product features.
        </p>
        <ButtonGroup>
          <LinkButton href="/authors" variant="accent">Open sample inventory</LinkButton>
          <LinkButton href="/graphql" target="_blank" rel="noreferrer">Open GraphQL playground</LinkButton>
        </ButtonGroup>
      </section>

      <section
        className={style({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        })}
      >
        <div className={style({ borderWidth: 1, borderStyle: 'solid', borderColor: 'gray-300', borderRadius: 'lg', padding: 16 })}>
          <h2 className={style({ marginTop: 0, marginBottom: 8, font: 'heading-sm' })}>Frontend stack</h2>
          <p className={style({ marginY: 0, color: 'gray-700' })}>
            React 19, TanStack Router, Apollo Client, and React Spectrum S2 for accessible and consistent UI.
          </p>
        </div>
        <div className={style({ borderWidth: 1, borderStyle: 'solid', borderColor: 'gray-300', borderRadius: 'lg', padding: 16 })}>
          <h2 className={style({ marginTop: 0, marginBottom: 8, font: 'heading-sm' })}>Backend stack</h2>
          <p className={style({ marginY: 0, color: 'gray-700' })}>
            Apollo Server with schema-first GraphQL modules, typed resolvers, and DataLoader patterns.
          </p>
        </div>
        <div className={style({ borderWidth: 1, borderStyle: 'solid', borderColor: 'gray-300', borderRadius: 'lg', padding: 16 })}>
          <h2 className={style({ marginTop: 0, marginBottom: 8, font: 'heading-sm' })}>Developer workflow</h2>
          <p className={style({ marginY: 0, color: 'gray-700' })}>
            Route + GraphQL codegen, Storybook, unit tests, Playwright, and a `check` command to validate PR readiness.
          </p>
        </div>
      </section>

      <Divider />

      <section className={style({ display: 'flex', flexDirection: 'column', gap: 12 })}>
        <h2 className={style({ marginY: 0, font: 'heading-lg' })}>Quick start path</h2>
        <ol className={style({ marginY: 0, paddingStart: 20, display: 'flex', flexDirection: 'column', gap: 8 })}>
          <li>Explore Authors, Books, and Tags inventories to see query/filter/sort CRUD patterns.</li>
          <li>Add a new GraphQL module and connect it to a page route.</li>
          <li>Run <code>npm run check</code> before opening your PR.</li>
        </ol>
        <div className={style({ display: 'flex', gap: 8, flexWrap: 'wrap' })}>
          <LinkButton href="/authors">Authors</LinkButton>
          <LinkButton href="/books">Books</LinkButton>
          <LinkButton href="/tags">Tags</LinkButton>
          <LinkButton href="/about">Architecture</LinkButton>
        </div>
      </section>
    </main>
  );
}
