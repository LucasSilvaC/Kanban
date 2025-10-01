import TaskCard from "../taskCard/TaskCard";
import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function Column({ id, title, icon: Icon, color, tasks = [], users = [], onEditTask, modalOpen }) {
  const columnId = String(id);
  const columnTitleId = `column-title-${columnId}`;

  return (
    <Droppable droppableId={columnId} isDropDisabled={modalOpen}>
      {(provided) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white shadow p-4 rounded-lg"
          aria-labelledby={columnTitleId}
          role="region"
          tabIndex={0}
          aria-label={`Coluna ${title} com ${tasks?.length || 0} tarefas`}
        >
          <h2
            id={columnTitleId}
            className="text-xl font-semibold text-[#5f679f] mb-4 flex items-center gap-2"
          >
            <Icon
              aria-hidden="true"
              focusable="false"
              className="w-5 h-5"
            />
            <span>{title}</span>
          </h2>

          <ul
            className="space-y-4 min-h-[50px]"
            role="list"
            aria-label={`Lista de tarefas em ${title}`}
          >
            {tasks?.map((task, index) =>
              task ? (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                  isDragDisabled={modalOpen}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      role="listitem"
                      tabIndex={0}
                      className={`${snapshot.isDragging ? "bg-gray-100 shadow-lg" : ""} transition-all rounded`}
                      aria-label={`Tarefa: ${task.description}`}
                    >
                      <TaskCard
                        task={task}
                        color={color}
                        users={users}
                        onEdit={() => onEditTask && onEditTask(task)}
                      />
                    </li>
                  )}
                </Draggable>
              ) : null
            )}
            {provided.placeholder}
          </ul>
        </section>
      )}
    </Droppable>
  );
}