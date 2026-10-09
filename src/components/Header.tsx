import { Button } from "./ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 h-20 border-b grid grid-cols-[auto_1fr_auto] items-stretch">
			<div className="flex items-center border-r-2 border-black px-6">
				<p className="font-bold text-2xl">JPDH</p>
			</div>

			<nav className="flex items-center">
				<ul className="flex w-full items-center justify-evenly">
					<li><a href="/">Home</a></li>
					<li><a href="/about">About</a></li>
					<li><a href="/contact">Contact</a></li>
					<li><a href="/contact">Quienes somos</a></li>
				</ul>
			</nav>

			<div className="flex items-center border-l-2 border-black px-6">
				<Button>Login</Button>
			</div>
		</header>


	)
}

