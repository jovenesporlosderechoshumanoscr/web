import {
  IconBuilding,
  IconHeartHandshake,
  IconHistory,
} from '@tabler/icons-react'

export const statsContent = {
  items: [
    {
      value: '+25,000',
      label: 'personas impactadas',
      Icon: IconHeartHandshake,
    },
    {
      value: '+120',
      label: 'instituciones apoyadas',
      Icon: IconBuilding,
    },
    {
      value: '15',
      label: 'años de servicio',
      Icon: IconHistory,
    },
  ],
} as const

export default function Stats() {
  return (
    <section aria-label="Nuestro impacto en cifras" className="border-y bg-muted">
      <ul className="mx-auto grid max-w-7xl grid-cols-1 px-4 py-12 sm:grid-cols-3 sm:divide-x sm:divide-border sm:px-6">
        {statsContent.items.map(({ value, label, Icon }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:py-2"
          >
            <Icon
              aria-hidden="true"
              className="size-6 text-muted-foreground"
            />
            <p className="text-4xl font-bold tracking-tight sm:text-5xl">
              {value}
            </p>
            <p className="text-sm font-medium text-muted-foreground uppercase">
              {label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
