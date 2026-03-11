import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from 'src/pages/Homepage/Homepage'

export const Route = createFileRoute('/')({
  component: HomePage
})
