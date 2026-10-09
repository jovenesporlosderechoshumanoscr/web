import Header from '@/components/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
	return (
		<div>
			<Header />
			<main className="page-wrap px-4 pb-8 pt-14">
				hola mundo
			</main>
		</div>
	)
}
