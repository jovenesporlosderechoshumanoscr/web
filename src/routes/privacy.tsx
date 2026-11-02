import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Política de privacidad</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Contenido pendiente de redacción.
      </p>
      <h2 className="mt-8 text-lg font-semibold">Boletín informativo</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Si te suscribes a nuestro boletín, utilizamos Brevo como encargado del
        tratamiento para gestionar tu suscripción y enviarte las campañas.
        Usamos confirmación por doble opt-in: recibirás un correo para verificar
        tu dirección antes de que comiences a recibir el boletín. Tus datos no
        se almacenan en este sitio; se procesan en Brevo (Sendinblue), que
        ofrece gestiones de baja automáticas en cada correo enviado.
      </p>
    </div>
  )
}
