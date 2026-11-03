import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
	head: () => ({
		meta: [{ title: 'Términos y condiciones — JPDH' }],
	}),
	component: RouteComponent,
})

function TermsSection({
	id,
	title,
	children,
}: {
	id: string
	title: string
	children: React.ReactNode
}) {
	return (
		<section aria-labelledby={id} className="mt-10 first:mt-0">
			<h2 id={id} className="text-lg font-semibold">
				{title}
			</h2>
			<div className="mt-3 space-y-3 text-sm text-muted-foreground">
				{children}
			</div>
		</section>
	)
}

function RouteComponent() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<Header />
			<main>
				<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
					<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
						Legal
					</p>
					<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
						Términos y condiciones de uso
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Última actualización: 3 de noviembre de 2026
					</p>

					<TermsSection id="tc-objeto" title="1. Objeto y aceptación">
						<p>
							Estos términos regulan el acceso y uso de este sitio web y de los
							servicios que ofrece JPDH a través de él: contenido informativo, blog,
							boletín informativo, cursos y cuentas de usuario. Al acceder, navegar o
							registrarte, aceptas estos términos. Si no estás de acuerdo, por favor
							no utilices el sitio.
						</p>
					</TermsSection>

					<TermsSection id="tc-identidad" title="2. Identificación del responsable">
						<p>
							JPDH es una organización con sede en Calle 21, entre Avenidas 2 y 6,
							San José, 10104, Costa Rica. Correo de contacto: contacto@jpdh.org.
							Tratamos los datos personales de los usuarios conforme a nuestra{' '}
							<a
								href="/privacy"
								className="font-medium text-foreground underline underline-offset-4"
							>
								Política de privacidad
							</a>
							.
						</p>
					</TermsSection>

					<TermsSection id="tc-uso" title="3. Uso del sitio y conducta">
						<p>Al usar el sitio, te comprometes a:</p>
						<ul className="list-disc pl-5">
							<li>
								usarlo únicamente con fines lícitos y respetuosos, compatibles con la
								misión de la organización;
							</li>
							<li>
								no intentar vulnerar la seguridad, disponibilidad o integridad del
								sitio (por ejemplo, ataques de fuerza bruta, inyección de código,
								scraping abusivo o pruebas de penetración sin autorización escrita);
							</li>
							<li>
								no publicar ni transmitir contenido ilegal, difamatorio,
								discriminatorio, que incite al odio o la violencia, o que infrinja
								derechos de terceros;
							</li>
							<li>
								no suplantar la identidad de otras personas ni usar cuentas ajenas.
							</li>
						</ul>
						<p>
							El uso indebido del sitio puede constituir un delito informático
							conforme a la Ley N.º 8668 de Costa Rica; en tal caso, además de
							restringir el acceso, podremos poner los hechos en conocimiento de las
							autoridades competentes.
						</p>
					</TermsSection>

					<TermsSection id="tc-cuentas" title="4. Cuentas de usuario">
						<ul className="list-disc pl-5">
							<li>
								Para acceder a cursos o funciones de usuario debes registrarte con
								información veraz, exacta y actualizada (nombre y correo
								electrónico).
							</li>
							<li>
								Eres responsable de mantener la confidencialidad de tu contraseña y de
								toda actividad realizada con tu cuenta. Notifícanos de inmediato
								cualquier uso no autorizado.
							</li>
							<li>
								El acceso a funciones administrativas está reservado al personal
								autorizado de la organización; los demás usuarios disponen de acceso
								de estudiante.
							</li>
							<li>
								Puedes solicitar la eliminación de tu cuenta en cualquier momento
								escribiendo a contacto@jpdh.org.
							</li>
						</ul>
					</TermsSection>

					<TermsSection id="tc-cursos" title="5. Contenido, cursos y boletín">
						<ul className="list-disc pl-5">
							<li>
								Los contenidos del sitio (textos, artículos, cursos y materiales)
								tienen fines educativos e informativos y no constituyen asesoría
								legal, médica ni profesional personalizada.
							</li>
							<li>
								Procuramos que la información sea actual y correcta, pero no
								garantizamos su integridad ni que esté libre de errores; el contenido
								puede cambiar sin previo aviso.
							</li>
							<li>
								La suscripción al boletín informativo es voluntaria, se confirma por
								doble opt-in y puedes darte de baja en cualquier momento desde cada
								correo recibido.
							</li>
						</ul>
					</TermsSection>

					<TermsSection id="tc-propiedad" title="6. Propiedad intelectual">
						<p>
							Los contenidos, marcas, diseños y materiales del sitio son titularidad
							de JPDH o de sus respectivos autores, y están protegidos por la
							legislación costarricense e internacional en materia de propiedad
							intelectual. Se permite el uso personal, no comercial, con
							atribución y sin modificaciones, citando la fuente. Cualquier otra
							reproducción, distribución o explotación requiere autorización previa
							por escrito.
						</p>
					</TermsSection>

					<TermsSection id="tc-enlaces" title="7. Enlaces a terceros">
						<p>
							El sitio puede contener enlaces a sitios de terceros (por ejemplo,
							nuestras redes sociales o herramientas como WhatsApp). No controlamos
							ni nos hacemos responsables de sus contenidos o prácticas de
							privacidad; te recomendamos revisar sus propias políticas. El
							servicio de infraestructura y entrega del sitio está prestado por
							Cloudflare, y el boletín informativo se gestiona con Brevo.
						</p>
					</TermsSection>

					<TermsSection id="tc-disponibilidad" title="8. Disponibilidad y suspensiones">
						<p>
							Buscamos que el sitio esté disponible de forma continua, pero no
							garantizamos que lo esté de manera ininterrumpida. Podemos suspender o
							modificar el sitio, total o parcialmente, por mantenimiento,
							actualizaciones o razones de seguridad. Asimismo, podemos suspender o
							eliminar cuentas que incumplan estos términos o que comprometan la
							seguridad del servicio.
						</p>
					</TermsSection>

					<TermsSection id="tc-responsabilidad" title="9. Limitación de responsabilidad">
						<p>
							En la máxima medida permitida por la ley, JPDH no responde por daños
							indirectos, incidentales o consecuentes derivados del uso o la
							imposibilidad de uso del sitio, ni por errores u omisiones en su
							contenido, salvo dolo o culpa grave imputable a la organización conforme
							a las normas de responsabilidad civil de Costa Rica.
						</p>
					</TermsSection>

					<TermsSection id="tc-privacidad" title="10. Protección de datos personales">
						<p>
							El tratamiento de tus datos se rige por la Política de privacidad,
							disponible en este sitio, y por la Ley N.º 8968 de Costa Rica. Te
							recomendamos leerla antes de crear una cuenta o suscribirte al boletín.
						</p>
					</TermsSection>

					<TermsSection id="tc-modificaciones" title="11. Modificaciones">
						<p>
							Podemos actualizar estos términos. La versión vigente y su fecha de
							actualización estarán siempre disponibles en esta página. Los cambios
							materiales se anunciarán con antelación razonable; el uso continuado del
							sitio después de publicado el cambio implica su aceptación.
						</p>
					</TermsSection>

					<TermsSection id="tc-ley" title="12. Ley aplicable y jurisdicción">
						<p>
							Estos términos se rigen por las leyes de la República de Costa Rica,
							incluidas la Ley N.º 8968 (protección de datos personales), la Ley
							N.º 8668 (delitos informáticos) y la Ley N.º 9159 (CERT y gestión de
							incidentes informáticos). Para cualquier controversia, las partes se
							someten a los tribunales competentes de San José, Costa Rica, con
							renuncia a cualquier otro fuero que pudiera corresponderles.
						</p>
					</TermsSection>
				</div>
			</main>
			<Footer />
		</div>
	)
}
