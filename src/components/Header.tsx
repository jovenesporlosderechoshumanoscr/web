import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 h-20 border-b grid grid-cols-[auto_1fr_auto] items-stretch">
			<div className="flex items-center border-r-2 border-black px-6">
				<p className="font-bold text-2xl">JPDH</p>
			</div>

			<nav className="flex items-center">
				<ul className="flex w-full items-center justify-evenly">
					<li><Link to="/">Inicio</Link></li>
					<li><Link to="/about">Acerca de nosotros</Link></li>
					<li><Link to="/contact">Contacto</Link></li>
					<li><Link to="/blog">Blog</Link></li>
				</ul>
			</nav>

			<div className="flex items-center border-l-2 border-black px-6">
				<Button>Login</Button>
			</div>
		</header>


	)
}

