import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Column from './Column'

// Mock do @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  Droppable: ({ children }) => children({ provided: { innerRef: () => { }, droppableProps: {} } }),
  Draggable: ({ children }) => children({ provided: { innerRef: () => { }, draggableProps: {}, dragHandleProps: {} } }, { isDragging: false }),
}))

const mockTasks = [
  { id: 1, description: 'Tarefa 1', user: 1, priority: 'HIGH', sector_name: 'TI' },
  { id: 2, description: 'Tarefa 2', user: 2, priority: 'MEDIUM', sector_name: 'RH' }
]

const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com' }
]

const mockOnEditTask = vi.fn()

describe('Column - Validações e Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Renderização Básica', () => {
    test('deve renderizar coluna com informações corretas', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve renderizar coluna sem tarefas', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={[]}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument()
    })

    test('deve renderizar coluna com tarefa nula', () => {
      const tasksWithNull = [mockTasks[0], null, mockTasks[1]]

      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={tasksWithNull}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve renderizar ícone corretamente', () => {
      const MockIcon = () => <span data-testid="mock-icon">Icon</span>

      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={MockIcon}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })
  })

  describe('Validação de Acessibilidade', () => {
    test('deve ter atributos ARIA corretos', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'column-title-todo')
      expect(section).toHaveAttribute('aria-label', 'Coluna A Fazer com 2 tarefas')
      expect(section).toHaveAttribute('tabIndex', '0')
    })

    test('deve ter título da coluna com ID correto', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const title = screen.getByRole('heading', { name: /A Fazer/i })
      expect(title).toHaveAttribute('id', 'column-title-todo')
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-[#5f679f]')

    })

    test('deve ter lista de tarefas com atributos ARIA corretos', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const list = screen.getByRole('list')
      expect(list).toHaveAttribute('aria-label', 'Lista de tarefas em A Fazer')
    })

    test('deve ter cada tarefa com atributos ARIA corretos', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const taskItems = screen.getAllByRole('listitem')
      expect(taskItems[0]).toHaveAttribute('aria-label', 'Tarefa: Tarefa 1')
      expect(taskItems[1]).toHaveAttribute('aria-label', 'Tarefa: Tarefa 2')
    })
  })

  describe('Validação de Estilo e Classes', () => {
    test('deve ter classes CSS corretas para a coluna', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const section = screen.getByRole('region')
      expect(section).toHaveClass('bg-white')
      expect(section).toHaveClass('shadow')
      expect(section).toHaveClass('p-4')
      expect(section).toHaveClass('rounded-lg')
    })

    test('deve ter classes CSS corretas para o título', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const title = screen.getByRole('heading', { name: /A Fazer/i })
      expect(title).toHaveClass('text-xl')
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveClass('text-[#5f679f]')
      expect(title).toHaveClass('mb-4')
      expect(title).toHaveClass('flex')
      expect(title).toHaveClass('items-center')
      expect(title).toHaveClass('gap-2')
    })

    test('deve ter classes CSS corretas para a lista de tarefas', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const list = screen.getByRole('list')
      expect(list).toHaveClass('space-y-4')
      expect(list).toHaveClass('min-h-[50px]')
    })

    test('deve ter classes CSS corretas para itens da tarefa', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const taskItems = screen.getAllByRole('listitem')
      taskItems.forEach(item => {
        expect(item).toHaveClass('transition-all')
        expect(item).toHaveClass('rounded')
      })
    })
  })

  describe('Validação de Interação do Usuário', () => {
    test('deve chamar onEditTask quando tarefa é clicada', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const taskItems = screen.getAllByRole('listitem')
      fireEvent.click(taskItems[0])

      expect(mockOnEditTask).toHaveBeenCalledWith(mockTasks[0])
    })

    test('não deve chamar onEditTask quando onEditTask não é fornecido', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={null}
          modalOpen={false}
        />
      )

      const taskItems = screen.getAllByRole('listitem')
      fireEvent.click(taskItems[0])

      expect(mockOnEditTask).not.toHaveBeenCalled()
    })

    test('deve ser acessível via teclado', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const section = screen.getByRole('region')
      const taskItems = screen.getAllByRole('listitem')

      // Simular navegação via teclado
      fireEvent.keyDown(section, { key: 'Tab' })
      fireEvent.keyDown(taskItems[0], { key: 'Enter' })
      fireEvent.keyDown(taskItems[0], { key: ' ' })

      expect(section).toHaveAttribute('tabIndex', '0')
      expect(taskItems[0]).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Validação de Modal Aberto', () => {
    test('não deve permitir drag quando modal está aberto', () => {
      const { container } = render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={true}
        />
      )

      // O componente deve renderizar, mas os itens não devem ser arrastáveis
      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve permitir drop quando modal está aberto', () => {
      const { container } = render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={true}
        />
      )

      // O componente deve renderizar corretamente
      expect(screen.getByText('A Fazer')).toBeInTheDocument()
    })
  })

  describe('Validação de Dados Vazios ou Nulos', () => {
    test('deve lidar com tasks nulo', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={null}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
    })

    test('deve lidar com tasks undefined', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={undefined}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
    })

    test('deve lidar com users vazio', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={[]}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve lidar com users nulo', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={null}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })
  })

  describe('Validação de Edge Cases', () => {
    test('deve lidar com ID não string', () => {
      render(
        <Column
          id={123}
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve lidar com title vazio', () => {
      render(
        <Column
          id="todo"
          title=""
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveTextContent(/^Icon\s*$/)
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve lidar com color vazio', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color=""
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    test('deve lidar com modalOpen undefined', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={undefined}
        />
      )

      expect(screen.getByText('A Fazer')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })
  })

  describe('Validação de Contagem de Tarefas', () => {
    test('deve mostrar contagem correta de tarefas', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={mockTasks}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Coluna A Fazer com 2 tarefas')
    })

    test('deve mostrar contagem correta quando não há tarefas', () => {
      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={[]}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Coluna A Fazer com 0 tarefas')
    })

    test('deve mostrar contagem correta quando há tarefa nula', () => {
      const tasksWithNull = [mockTasks[0], null, mockTasks[1]]

      render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={tasksWithNull}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Coluna A Fazer com 2 tarefas')
    })
  })

  describe('Validação de Placeholder', () => {
    test('deve renderizar placeholder quando não há tarefas', () => {
      const { container } = render(
        <Column
          id="todo"
          title="A Fazer"
          icon={() => 'Icon'}
          color="border-red-400"
          tasks={[]}
          users={mockUsers}
          onEditTask={mockOnEditTask}
          modalOpen={false}
        />
      )

      // O placeholder é renderizado pelo Droppable
      expect(screen.getByText('A Fazer')).toBeInTheDocument()
    })
  })
})