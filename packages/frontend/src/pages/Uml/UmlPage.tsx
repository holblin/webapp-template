import { ButtonGroup, Divider, LinkButton } from '@react-spectrum/s2'
import { style } from '@react-spectrum/s2/style' with { type: 'macro' }
import { defaultUmlEdges, defaultUmlNodes } from 'src/pages/Uml/UmlPage.graph';
import { UmlGraph } from 'src/components/UmlGraph/UmlGraph';
import { useTheme } from 'src/providers/Theme';

export const UmlPage = () => {
  const { theme } = useTheme();

  return (
    <main className={style({ width: 'full', flexGrow: 1, minHeight: 0, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 })}>
      <section className={style({ borderWidth: 1, borderStyle: 'solid', borderColor: 'gray-300', borderRadius: 'xl', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: 'gray-50' })}>
        <h1 className={style({ marginY: 0, font: 'heading-lg' })}>UML Domain Graph</h1>
        <p className={style({ marginY: 0, font: 'body-sm', color: 'gray-800' })}>
          Graph generated from your current GraphQL model: each Book has exactly one Author, and Book/Tag is many-to-many.
        </p>
        <ButtonGroup>
          <LinkButton href="/authors">Authors</LinkButton>
          <LinkButton href="/books">Books</LinkButton>
          <LinkButton href="/tags">Tags</LinkButton>
        </ButtonGroup>
      </section>

      <Divider />

      <UmlGraph theme={theme} nodes={defaultUmlNodes} edges={defaultUmlEdges} />
    </main>
  )
}
