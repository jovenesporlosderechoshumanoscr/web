import { Link } from '@tanstack/react-router'
import {
  IconArrowRight,
  IconBook,
  IconChalkboard,
  IconSchool,
  IconVideo,
  IconUsersGroup,
  IconBuildingBridge,
} from '@tabler/icons-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const whatWeDoContent = {
  eyebrow: '¿Qué hacemos?',
  title: 'Educación en derechos humanos para todas las edades',
  paragraphs: [
    'Desarrollamos seminarios, charlas, talleres, materiales didácticos, capacitación a docentes y alianzas con instituciones para que las personas conozcan, comprendan y apliquen sus derechos humanos.',
  ],
  link: { label: 'Conoce qué hacemos', href: '/what-we-do' },
  items: [
    {
      title: 'Seminarios y charlas',
      description:
        'Actividades educativas en centros educativos, universidades, instituciones públicas y comunidades.',
      Icon: IconChalkboard,
    },
    {
      title: 'Talleres y actividades',
      description:
        'Experiencias prácticas dirigidas a niños, jóvenes, docentes y personas de todas las edades.',
      Icon: IconUsersGroup,
    },
    {
      title: 'Materiales didácticos',
      description:
        'Publicaciones, videos y herramientas educativas sobre los 30 derechos humanos.',
      Icon: IconBook,
    },
    {
      title: 'Capacitación a docentes',
      description:
        'Apoyamos a los educadores para incorporar los derechos humanos en sus aulas.',
      Icon: IconSchool,
    },
    {
      title: 'Materiales audiovisuales',
      description:
        'Videos y recursos que facilitan la enseñanza de los derechos humanos.',
      Icon: IconVideo,
    },
    {
      title: 'Alianzas institucionales',
      description:
        'Colaboramos con instituciones y organizaciones para ampliar el alcance de los programas.',
      Icon: IconBuildingBridge,
    },
  ],
} as const

export default function WhatWeDo() {
  return (
    <section
      aria-labelledby="what-we-do-title"
      id="que-hacemos"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
        {whatWeDoContent.eyebrow}
      </p>
      <h2
        id="what-we-do-title"
        className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
      >
        {whatWeDoContent.title}
      </h2>
      {whatWeDoContent.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 24)}
          className="mt-5 max-w-2xl text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}
      <Link
        to={whatWeDoContent.link.href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {whatWeDoContent.link.label}
        <IconArrowRight aria-hidden="true" className="size-4" />
      </Link>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whatWeDoContent.items.map(({ title, description, Icon }) => (
          <Card key={title}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  )
}
