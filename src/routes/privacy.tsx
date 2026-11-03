import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
	head: () => ({
		meta: [{ title: 'Política de privacidad — JPDH' }],
	}),
	component: RouteComponent,
})

function PrivacySection({
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
						Política de privacidad
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Última actualización: 3 de noviembre de 2026
					</p>

					<PrivacySection id="pp-responsable" title="1. Responsable del tratamiento">
						<p>
							Este sitio web y las cuentas asociadas son operados por JPDH
							(&laquo;nosotros&raquo;, &laquo;el sitio&raquo;), con sede en Calle 21,
							entre Avenidas 2 y 6, San José, 10104, Costa Rica. Correo de contacto
							para temas de privacidad:{' '}
							<a
								href="mailto:contacto@jpdh.org"
								className="font-medium text-foreground underline underline-offset-4"
							>
								contacto@jpdh.org
							</a>
							.
						</p>
						<p>
							Tratamos tus datos personales conforme a la{' '}
							<strong className="text-foreground">
								Ley N.º 8968, Ley de Protección de la Persona frente al Tratamiento
								de sus Datos Personales
							</strong>
							, la Constitución Política de Costa Rica, la{' '}
							<strong className="text-foreground">Ley N.º 8668 (Delitos Informáticos)</strong>{' '}
							y la{' '}
							<strong className="text-foreground">
								Ley N.º 9159 (CERT y Gestión de Incidentes Informáticos)
							</strong>
							, así como demás normativa costarricense aplicable.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-alcance" title="2. Alcance">
						<p>
							Esta política aplica a toda la información recolectada por este sitio
							web, incluidos el contenido público (blog, información sobre la
							organización), la creación de cuentas de usuario, la inscripción a
							cursos y el boletín informativo. No aplica a sitios o servicios de
							terceros que enlazamos o que operan de forma independiente.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-recolectamos" title="3. Información que recolectamos">
						<p>Recolectamos únicamente lo mínimo necesario para operar el sitio:</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Cuenta de usuario:</strong> nombre
								para mostrar y dirección de correo electrónico, que tú nos provees al
								registrarte. También registramos si el correo fue verificado y la fecha
								de creación de la cuenta.
							</li>
							<li>
								<strong className="text-foreground">Contraseña:</strong> la
								almacenamos únicamente como hash criptográfico; nunca guardamos ni
								podemos leer tu contraseña en texto plano.
							</li>
							<li>
								<strong className="text-foreground">Sesión:</strong> para mantenerte
								autenticado usamos una cookie técnica de sesión (ve la sección 5).
							</li>
							<li>
								<strong className="text-foreground">Comunicaciones voluntarias:</strong>{' '}
								si nos escribes por correo, WhatsApp o los canales publicados en la
								página de contacto, conservamos tu mensaje y tus datos de contacto
								para responder.
							</li>
							<li>
								<strong className="text-foreground">Boletín informativo:</strong>{' '}
								suscripción con dirección de correo, gestionada en Brevo (sección 8).
							</li>
						</ul>
						<p>
							No recolectamos datos de pago, documentos de identidad ni datos
							catalogados como sensibles (salud, ideología, religión, preferencias
							sexuales, entre otros). Te pedimos que no los incluyas en los campos del
							sitio.
						</p>
					</PrivacySection>

					<PrivacySection
						id="pp-tecnica"
						title="4. Información técnica procesada por la infraestructura"
					>
						<p>
							Al visitar el sitio, nuestro proveedor de infraestructura (Cloudflare,
							sección 8) procesa automáticamente datos técnicos necesarios para
							entregar el contenido y protegerlo contra abusos:
						</p>
						<ul className="list-disc pl-5">
							<li>dirección IP y datos derivados de ella (país o región);</li>
							<li>
								cabeceras HTTP, tipo de navegador y sistema operativo (agente de
								usuario);
							</li>
							<li>
								fecha, hora y estado de la solicitud, URL solicitada y sitio de
								procedencia.
							</li>
						</ul>
						<p>
							Estos datos se utilizan con fines de seguridad, prevención de fraude y
							abuso, estabilidad del servicio y estadísticas agregadas de tráfico. No
							se utilizan para perfilar tus gustos ni para publicidad.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-cookies" title="5. Cookies">
						<p>
							Este sitio <strong className="text-foreground">no usa cookies de rastreo, publicitarias ni de análisis de terceros</strong>.
							Solo utilizamos:
						</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Cookie de sesión:</strong> estrictamente necesaria para mantenerte autenticado mientras usas
								tu cuenta. Se elimina al cerrar sesión.
							</li>
						</ul>
						<p>
							Puedes bloquear o eliminar cookies desde tu navegador; si bloqueas la
							cookie de sesión, no podrás iniciar sesión, pero el contenido público
							del sitio seguirá disponible.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-google" title="6. Google (SEO)">
						<p>
							Utilizamos herramientas de Google únicamente con fines de posicionamiento
							en buscadores y no de rastreo de personas:
						</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Google Search Console:</strong> nos
								permite ver cómo Google rastrea e indexa el sitio (URLs consultadas,
								errores de rastreo, impresiones y consultas agregadas). Estos datos
								son agregados y anónimos, y no contienen información identificable de
								visitantes individuales.
							</li>
							<li>
								<strong className="text-foreground">Indexación y bots:</strong> no
								bloqueamos a los rastreadores de buscadores; publicamos sitemap y
								datos estructurados (metadatos) para mejorar cómo se muestra el sitio
								en resultados de búsqueda.
							</li>
						</ul>
						<p>
							En este sitio <strong className="text-foreground">no</strong> usamos Google
							Analytics, Google Ads, ni ninguna herramienta de medición o publicidad
							de Google que genere cookies o identifiques a los visitantes. Si en el
							futuro incorporamos alguna, actualizaremos esta política y avisaremos
							con antelación.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-uso" title="7. Cómo usamos la información">
						<p>Tratamos tu información exclusivamente para:</p>
						<ul className="list-disc pl-5">
							<li>crear, administrar y proteger tu cuenta de usuario;</li>
							<li>proporcionarte acceso a los cursos y contenidos asignados;</li>
							<li>enviar correos de verificación, recuperación de contraseña y avisos de tu cuenta;</li>
							<li>
								enviar el boletín informativo si te suscribiste (con baja disponible en
								todo correo);
							</li>
							<li>responder tus consultas y solicitudes;</li>
							<li>
								mantener la seguridad del sitio, prevenir abusos y atender incidentes
								informáticos;
							</li>
							<li>cumplir obligaciones legales aplicables en Costa Rica.</li>
						</ul>
						<p>
							No utilizamos tus datos para toma de decisiones automatizadas, no los
							cedemos para publicidad ni los usamos para fines incompatibles con estos.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-terceros" title="8. Encargados y proveedores externos">
						<p>
							Compartimos datos con un grupo muy reducido de proveedores, que actúan
							como encargados del tratamiento y solo procesan la información
							necesaria para brindar el servicio:
						</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Cloudflare:</strong> aloja y entrega
								el sitio y su infraestructura (Workers), y provee protección contra
								ataques y abusos (CDN, WAF). Procesa datos técnicos de conexión
								(sección 4) conforme a su propia política de privacidad y de
								retención de registros.
							</li>
							<li>
								<strong className="text-foreground">Brevo (Sendinblue):</strong>{' '}
								gestiona el boletín informativo. Almacenamos tu correo de suscripción
								y el estado de la suscripción en Brevo, con confirmación por doble
								opt-in: recibirás un correo para verificar tu dirección antes de
								recibir campañas. Cada correo incluye enlaces de baja automática.
							</li>
						</ul>
						<p>
							<strong className="text-foreground">Lo que NO compartimos:</strong> no
							vendemos, alquilamos ni negociamos tus datos personales. No los
							entregamos a agencias de publicidad, redes publicitarias ni
							corredores de datos. No revelamos tu identidad a terceros con fines
							comerciales.
						</p>
						<p>
							Solo podríamos divulgar información fuera de lo anterior cuando la ley
							nos obligue (por ejemplo, una orden judicial o requerimiento de
							autoridad competente en Costa Rica) o cuando sea necesario para
							defender derechos en un proceso legal, en la mínima medida posible.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-retencion" title="9. Retención de datos">
						<p>Conservamos tu información solo durante el tiempo necesario:</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Cuenta:</strong> mientras tu cuenta
								exista. Si solicitas eliminar tu cuenta, eliminamos tus datos
								personales en un plazo máximo de 90 días, salvo copias de respaldo
								que se purgan en el siguiente ciclo de rotación.
							</li>
							<li>
								<strong className="text-foreground">Sesiones:</strong> se eliminan al
								cerrarse o expirar la sesión.
							</li>
							<li>
								<strong className="text-foreground">Boletín (Brevo):</strong>{' '}
								mientras el destinatario esté suscrito; al darte de baja, tu dirección
								deja de recibir envíos y se conserva únicamente para mantener la
								exclusión, hasta que solicites su eliminación.
							</li>
							<li>
								<strong className="text-foreground">Comunicaciones por correo o WhatsApp:</strong>{' '}
								durante el tiempo necesario para atender tu consulta y, a lo sumo,
								mientras exista interés legítimo o plazo legal de conservación.
							</li>
							<li>
								<strong className="text-foreground">Registros técnicos (Cloudflare):</strong>{' '}
								según los periodos definidos en la política de retención de Cloudflare,
								vinculados a seguridad y no al perfilado de usuarios.
							</li>
							<li>
								<strong className="text-foreground">Datos que la ley obligue a conservar:</strong>{' '}
								se retienen por el plazo legal y, luego, se eliminan de forma segura.
							</li>
						</ul>
					</PrivacySection>

					<PrivacySection id="pp-derechos" title="10. Tus derechos">
						<p>
							Conforme a la Ley N.º 8968, puedes ejercer en cualquier momento tu
							derecho de acceso, rectificación, actualización y cancelación de tus
							datos personales, así como revocar el consentimiento otorgado:
						</p>
						<ul className="list-disc pl-5">
							<li>
								<strong className="text-foreground">Acceso y rectificación:</strong>{' '}
								consulta o corrige tu nombre y correo desde tu perfil de usuario, o
								escríbenos.
							</li>
							<li>
								<strong className="text-foreground">Eliminación de cuenta:</strong>{' '}
								solicítala a contacto@jpdh.org y la procesaremos (sección 9).
							</li>
							<li>
								<strong className="text-foreground">Baja del boletín:</strong> con el
								enlace presente en cada correo o escribiéndonos.
							</li>
						</ul>
						<p>
							Responderemos en un plazo razonable y siempre con la mayor celeridad
							posible. Si consideras que tus derechos no fueron atendidos, puedes
							acudir a las autoridades competentes de Costa Rica o ejercer las
							acciones de protección que la ley reconoce.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-seguridad" title="11. Seguridad">
						<p>
							Aplicamos medidas técnicas y organizativas razonables: cifrado del
							tráfico (HTTPS/TLS), almacenamiento de contraseñas como hash, control de
							accessos por roles, mínimos privilegios y protección de la
							infraestructura a través de Cloudflare. Ningún sistema es infalible; si
							sospechas de un incidente, repórtalo de inmediato a contacto@jpdh.org.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-menores" title="12. Menores de edad">
						<p>
							El sitio no está dirigido a menores de 13 años. No creamos cuentas ni
							recolectamos datos de menores de esa edad a sabiendas. Si eres madre,
							padre o tutor y crees que un menor nos proporcionó datos, escríbenos
							para eliminarlos.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-cambios" title="13. Cambios a esta política">
						<p>
							Podemos actualizar esta política para reflejar cambios en el sitio o en
							la legislación. Publicaremos aquí la versión vigente con su fecha de
							actualización; si el cambio afecta de forma relevante el tratamiento de
							tus datos, lo avisaremos con antelación razonable.
						</p>
					</PrivacySection>

					<PrivacySection id="pp-ley" title="14. Ley aplicable">
						<p>
							Esta política se rige por las leyes de la República de Costa Rica,
							en particular la Ley N.º 8968, la Ley N.º 8668, la Ley N.º 9159 y las
							disposiciones de la Constitución Política en materia de protección de
							la intimidad y las comunicaciones.
						</p>
					</PrivacySection>
				</div>
			</main>
			<Footer />
		</div>
	)
}
