import { createFileRoute } from '@tanstack/react-router'
import { UmlPage } from 'src/pages/Uml/UmlPage'

export const Route = createFileRoute('/uml')({
  component: UmlPage,
})
