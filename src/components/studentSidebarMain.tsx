import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import {
  IconBook,
  IconChevronRight,
  IconScale,
  IconUsers,
} from "@tabler/icons-react"
import type { CourseModule } from "@/lib/course"

const moduleIcons: Record<string, React.ReactNode> = {
  "modulo-1": <IconBook />,
  "modulo-2": <IconScale />,
  "modulo-3": <IconUsers />,
}

/**
 * Navegación mock de los módulos del curso. Los módulos se expanden con
 * el chevron y los ítems son texto inerte: no enlazan a ningún contenido
 * (el curso no es funcional por ahora).
 */
export function StudentSidebarMain({
  modules,
}: {
  modules: CourseModule[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Curso</SidebarGroupLabel>
      <SidebarMenu>
        {modules.map((module) => (
          <Collapsible key={module.id}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={module.title}>
                {moduleIcons[module.id]}
                <span>{module.title}</span>
              </SidebarMenuButton>
              <CollapsibleTrigger
                render={
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <IconChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                }
              />
              <CollapsibleContent>
                <SidebarMenuSub>
                  {module.items.map((item) => (
                    <SidebarMenuSubItem key={item.id}>
                      <SidebarMenuSubButton render={<span />}>
                        <span>{item.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
