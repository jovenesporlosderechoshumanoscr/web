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
import { IconBook, IconChevronRight } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

type SidebarLesson = {
	id: string
	title: string
}

type SidebarCourse = {
	id: string
	slug: string
	title: string
	modules: Array<{
		id: string
		title: string
		lessons: SidebarLesson[]
	}>
}

/**
 * Navegación real de los cursos publicados: un grupo por curso, módulos
 * expandibles y lecciones que enlazan a la vista de lectura/quiz. El
 * anidamiento es group > li (módulo) > ul > li (lección): nunca li > li.
 */
export function StudentSidebarMain({
	courses,
}: {
	courses: SidebarCourse[]
}) {
	if (courses.length === 0) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel>Cursos</SidebarGroupLabel>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Mis cursos"
							render={<Link to="/student/courses" />}
						>
							<IconBook />
							<span>Mis cursos</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		)
	}

	return (
		<>
			{courses.map((course) => (
				<SidebarGroup key={course.id}>
					<SidebarGroupLabel render={<span />}>
						<Link
							to="/student/courses/$courseSlug"
							params={{ courseSlug: course.slug }}
							className="hover:underline"
						>
							{course.title}
						</Link>
					</SidebarGroupLabel>
					<SidebarMenu>
						{course.modules.map((module) => (
							<Collapsible key={module.id}>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip={module.title}>
										<IconBook />
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
											{module.lessons.map((lesson) => (
												<SidebarMenuSubItem key={lesson.id}>
													<SidebarMenuSubButton
														render={
															<Link
																to="/student/courses/$courseSlug/lesson/$lessonId"
																params={{
																	courseSlug: course.slug,
																	lessonId: lesson.id,
																}}
															/>
														}
													>
														<span>{lesson.title}</span>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
											{module.lessons.length === 0 && (
												<SidebarMenuSubItem>
													<SidebarMenuSubButton render={<span />}>
														<span className="text-muted-foreground">
															Sin lecciones
														</span>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											)}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
						{course.modules.length === 0 && (
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip="Ver curso"
									render={
										<Link to="/student/courses/$courseSlug" params={{ courseSlug: course.slug }} />
									}
								>
									<IconBook />
									<span>Sin módulos</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarGroup>
			))}
		</>
	)
}
