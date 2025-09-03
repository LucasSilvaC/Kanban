import TaskCard from "../taskCard/TaskCard";
import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function Column({ id, title, icon: Icon, color, tasks = [], users = [], onEditTask }) {
  return (
    <Droppable droppableId={String(id)}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white shadow p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-[#5f679f] mb-4 flex items-center gap-2">
            <Icon /> {title}
          </h2>

          <div className="space-y-4 min-h-[50px]">
            {tasks?.map((task, index) =>
              task ? (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? "bg-gray-100 shadow-lg" : ""} transition-all`}
                    >
                      <TaskCard
                        task={task}
                        color={color}
                        users={users}
                        onEdit={() => onEditTask && onEditTask(task)} 
                      />
                    </div>
                  )}
                </Draggable>
              ) : null
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}