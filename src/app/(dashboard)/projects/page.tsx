"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { PageHeader } from "@/components/layout/PageHeader"
import { LayoutDashboard, Plus, MoreVertical, Calendar, User2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useGrabScroll } from "@/hooks/use-grab-scroll"
import { ProjectCardModal } from "@/components/projects/ProjectCardModal"
import { cn } from "@/lib/utils"

const COLUMNS = [
  { id: "A fazer", title: "A fazer" },
  { id: "Em produção", title: "Em produção" },
  { id: "Revisão Interna", title: "Revisão Interna" },
  { id: "Alteração", title: "Alteração" },
  { id: "Aprovação Cliente", title: "Aprovação Cliente" },
  { id: "Aprovado", title: "Aprovado" },
]

const INITIAL_PROJECTS = [
  { id: "1", title: "Social Media Nike", client: "Nike", status: "Em produção", priorities: ["alta"], assignees: ["Witalo A."], deliveryDate: new Date(), description: "Posts semanais para o Instagram.", references: [], deliverables: [] },
  { id: "2", title: "Website Redesign", client: "Apple", status: "Revisão Interna", priorities: ["alta"], assignees: ["Ana B."], deliveryDate: new Date(), description: "Novo layout da home.", references: [], deliverables: [] },
  { id: "3", title: "Campanha Google Ads", client: "Google", status: "Aprovação Cliente", priorities: ["media"], assignees: ["Lucas C."], deliveryDate: new Date(), description: "Setup das campanhas de pesquisa.", references: [], deliverables: [] },
]

export default function ProjectsPage() {
  const [mounted, setMounted] = React.useState(false)
  const [projects, setProjects] = React.useState(INITIAL_PROJECTS)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<any>(null)
  
  const { scrollRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useGrabScroll()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeProject = projects.find(p => p.id === activeId)
    const overProject = projects.find(p => p.id === overId)

    // Moving to a column or over another card
    const overColumn = COLUMNS.find(c => c.id === overId)
    
    if (activeProject) {
      if (overColumn && activeProject.status !== overColumn.id) {
        setProjects(prev => prev.map(p => p.id === activeId ? { ...p, status: overColumn.id } : p))
      } else if (overProject && activeProject.status !== overProject.status) {
        setProjects(prev => prev.map(p => p.id === activeId ? { ...p, status: overProject.status } : p))
      }
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) {
      setActiveId(null)
      return
    }

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      
      if (newIndex !== -1) {
        setProjects((items) => arrayMove(items, oldIndex, newIndex))
      }
    }

    setActiveId(null)
  }

  const openCreateModal = () => {
    setSelectedProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleSaveProject = (data: any) => {
    if (selectedProject) {
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...data, id: p.id } : p))
    } else {
      const newProject = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      }
      setProjects(prev => [...prev, newProject])
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setIsModalOpen(false)
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Projetos" 
        description="Gestão de fluxo de trabalho e kanban"
        icon={LayoutDashboard}
        actions={
          <Button onClick={openCreateModal} className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2">
            <Plus className="w-4 h-4" /> Novo Projeto
          </Button>
        }
      />

      <DndContext
        id="kanban-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex-1 flex gap-8 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 cursor-grab"
        >
          {COLUMNS.map((col) => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              projects={projects.filter(p => p.status === col.id)}
              onEdit={openEditModal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeId ? (
            <ProjectCard 
              project={projects.find(p => p.id === activeId)} 
              isOverlay 
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <ProjectCardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />
    </div>
  )
}

function KanbanColumn({ id, title, projects, onEdit }: any) {
  return (
    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-secondary/5 rounded-3xl p-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
          <Badge variant="secondary" className="rounded-full bg-background text-[10px] font-black border-none">
            {projects.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      <SortableContext
        id={id}
        items={projects.map((p: any) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-4">
          {projects.map((proj: any) => (
            <SortableProjectCard key={proj.id} project={proj} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableProjectCard({ project, onEdit }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card-draggable outline-none">
      <ProjectCard project={project} onClick={() => onEdit(project)} />
    </div>
  )
}

function ProjectCard({ project, isOverlay, onClick }: any) {
  if (!project) return null

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-background/60 backdrop-blur-sm rounded-2xl",
        isOverlay && "rotate-3 scale-105 shadow-2xl border-2 border-audazz-blue"
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1 overflow-hidden">
          <Badge className="bg-audazz-blue/10 text-audazz-blue border-none text-[9px] uppercase font-black px-2 py-0">
            {project.client}
          </Badge>
          <CardTitle className="text-sm font-black leading-tight truncate group-hover:text-audazz-blue transition-colors">
            {project.title}
          </CardTitle>
        </div>
        <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-audazz-blue transition-colors" />
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {project.priorities.map((p: string) => (
            <div key={p} className="flex items-center gap-1">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                p === 'urgente' ? 'bg-red-600' : p === 'alta' ? 'bg-red-400' : 'bg-green-400'
              )} />
              <span className="text-[9px] font-black uppercase text-muted-foreground">{p}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between border-t pt-3 border-secondary/10">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-[8px] bg-audazz-blue text-white font-bold">
                {project.assignees?.[0]?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-bold text-muted-foreground">
              {project.assignees?.[0] || "Sem responsável"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black">
            <Calendar className="w-3 h-3" /> 
            {project.deliveryDate ? format(project.deliveryDate, "dd MMM") : "--"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


