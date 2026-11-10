import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import { useSidebarCourses } from '@/functions/course-client'
import { StudentSidebarMain } from './studentSidebarMain'
import { StudentSidebarUser } from './studentSidebarUser'

export function StudentSidebar({
  user,
}: {
  user: { name: string; email: string }
}) {
  // Cursos publicados con módulos y lecciones reales (antes era un mock).
  const sidebarQuery = useSidebarCourses()
  const courses = sidebarQuery.data?.courses ?? []

  return (
    <Sidebar>
      <SidebarHeader className="py-2">
        <img src="/logojpdh.webp" alt="JPDH" className="size-12 shrink-0 object-contain" />
        <p className="text-sm">Bienvenido {user.name}</p>
      </SidebarHeader>
      <SidebarContent>
        <StudentSidebarMain courses={courses} />
      </SidebarContent>
      <SidebarFooter>
        <StudentSidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
