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
        <h1 className="text-2xl font-bold">JPDH</h1>
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
