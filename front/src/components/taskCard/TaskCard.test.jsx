import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import axios from 'axios'
import TaskCard from './TaskCard'

// Mock do axios
vi.mock('axios')

const mockTask = {
  id: 1,
  user: 1,
  description: 'Testar aplicativo',
  sector_name: 'TI',
  priority: 'HIGH',
  status: 'TODO'
}

const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com' }
]

const mockRefreshTasks = vi.fn()

describe('TaskCard - Validações e Testes de UI', () => {
  const mockOnEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Renderização Básica', () => {
    test('deve renderizar o card com informações corretas', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('TI')).toBeInTheDocument()
      expect(screen.getByText('Editar')).toBeInTheDocument()
    })

    test('deve mostrar prioridade correta', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const priorityIndicator = screen.getByRole('status', { name: /Alta prioridade/i })
      expect(priorityIndicator).toBeInTheDocument()
      expect(priorityIndicator).toHaveClass('bg-red-500')
    })

    test('deve mostrar setor correto', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('TI')).toBeInTheDocument()
      expect(screen.getByLabelText(/Setor: TI/i)).toBeInTheDocument()
    })

    test('deve mostrar cores corretas para diferentes prioridades', () => {
      const tasks = [
        { ...mockTask, priority: 'LOW', sector_name: 'TI' },
        { ...mockTask, priority: 'MEDIUM', sector_name: 'TI' },
        { ...mockTask, priority: 'HIGH', sector_name: 'TI' }
      ]

      const priorities = ['Baixa prioridade', 'Média prioridade', 'Alta prioridade']
      const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500']

      tasks.forEach((task, index) => {
        const { rerender, container } = render(<TaskCard task={task} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

        const priorityIndicator = container.querySelector(`[aria-label="${priorities[index]}"]`)
        expect(priorityIndicator).toHaveClass(colors[index])

        rerender(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)
      })
    })
  })

  describe('Validação de Modal', () => {
    test('deve abrir modal quando botão de editar é clicado', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      expect(screen.getByText('Editar Tarefa')).toBeInTheDocument()
    })

    test('deve fechar modal quando botão de fechar é clicado', async () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      // Abrir modal
      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      expect(screen.getByText('Editar Tarefa')).toBeInTheDocument()

      // Fechar modal
      const closeButton = screen.getByRole('button', { name: /Fechar/i })
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Editar Tarefa')).not.toBeInTheDocument()
      })
    })

    test('deve chamar onEdit quando botão de editar é clicado', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} onEdit={mockOnEdit} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
    })

    test('não deve chamar onEdit quando onEdit não é fornecido', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      expect(mockOnEdit).not.toHaveBeenCalled()
    })
  })

  describe('Validação de Acessibilidade', () => {
    test('deve ter atributos ARIA corretos', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByRole('group')).toBeInTheDocument()
      expect(screen.getByText('Testar aplicativo')).toHaveAttribute('id', 'task-title-1')
      expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'task-title-1')
      expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Cartão de tarefa: Testar aplicativo')
    })

    test('deve ter botão de acessível', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      expect(editButton).toBeInTheDocument()
      expect(editButton).toHaveAttribute('aria-label', 'Editar tarefa: Testar aplicativo')
    })
  })

  describe('Validação de Dados Vazios ou Nulos', () => {
    test('deve lidar com descrição vazia', () => {
      const taskWithEmptyDescription = { ...mockTask, description: '' }
      render(<TaskCard task={taskWithEmptyDescription} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('TI')).toBeInTheDocument()
      expect(screen.getByText('Editar')).toBeInTheDocument()
    })

    test('deve lidar com setor vazio', () => {
      const taskWithEmptySector = { ...mockTask, sector_name: '' }
      render(<TaskCard task={taskWithEmptySector} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('Editar')).toBeInTheDocument()
    })

    test('deve lidar com prioridade inválida', () => {
      const taskWithInvalidPriority = { ...mockTask, priority: 'INVALID' }
      render(<TaskCard task={taskWithInvalidPriority} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const priorityIndicator = screen.getByRole('status', { name: /Prioridade indefinida/i })
      expect(priorityIndicator).toHaveClass('bg-gray-400')
    })

    test('deve lidar com task nulo', () => {
      const { container } = render(<TaskCard task={null} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Validação de Estilo e Classes', () => {
    test('deve ter classes CSS corretas', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const taskCard = screen.getByRole('group')
      expect(taskCard).toHaveClass('p-5')
      expect(taskCard).toHaveClass('bg-white')
      expect(taskCard).toHaveClass('border-l-4')
      expect(taskCard).toHaveClass('border-red-400')
      expect(taskCard).toHaveClass('rounded-xl')
      expect(taskCard).toHaveClass('shadow-md')
      expect(taskCard).toHaveClass('hover:shadow-xl')
      expect(taskCard).toHaveClass('transition-all')
      expect(taskCard).toHaveClass('duration-300')
      expect(taskCard).toHaveClass('transform')
      expect(taskCard).toHaveClass('hover:-translate-y-1')
      expect(taskCard).toHaveClass('flex')
      expect(taskCard).toHaveClass('flex-col')
      expect(taskCard).toHaveClass('justify-between')
    })

    test('deve ter classes CSS corretas para botão de editar', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      expect(editButton).toHaveClass('text-sm')
      expect(editButton).toHaveClass('text-[#5f679f]')
      expect(editButton).toHaveClass('hover:text-[#4a5585]')
      expect(editButton).toHaveClass('font-medium')
      expect(editButton).toHaveClass('transition-colors')
      expect(editButton).toHaveClass('focus:outline-none')
      expect(editButton).toHaveClass('focus:ring-2')
      expect(editButton).toHaveClass('focus:ring-[#5f679f]')
      expect(editButton).toHaveClass('rounded')
      expect(editButton).toHaveClass('px-2')
      expect(editButton).toHaveClass('py-1')
    })
  })

  describe('Validação de Interação do Usuário', () => {
    test('deve responder a hover no card', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const taskCard = screen.getByRole('group')

      // Simular hover
      fireEvent.mouseEnter(taskCard)
      fireEvent.mouseLeave(taskCard)

      // O card deve ter as classes de hover
      expect(taskCard).toHaveClass('hover:shadow-xl')
      expect(taskCard).toHaveClass('hover:-translate-y-1')
    })

    test('deve responder a focus no botão de editar', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })

      // Simular focus
      fireEvent.focus(editButton)
      fireEvent.blur(editButton)

      // O botão deve ter as classes de focus
      expect(editButton).toHaveClass('focus:outline-none')
      expect(editButton).toHaveClass('focus:ring-2')
      expect(editButton).toHaveClass('focus:ring-[#5f679f]')
      expect(editButton).toHaveClass('rounded')
    })

    test('deve ser clicável e acessível via teclado', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const taskCard = screen.getByRole('group')

      // Simular clique via teclado
      fireEvent.keyDown(taskCard, { key: 'Enter' })
      fireEvent.keyDown(taskCard, { key: ' ' })

      // O card deve ser clicável
      expect(taskCard).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Validação de Dados Longos', () => {
    test('deve lidar com descrição muito longa', () => {
      const longDescription = 'a'.repeat(200)
      const taskWithLongDescription = { ...mockTask, description: longDescription }

      render(<TaskCard task={taskWithLongDescription} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    test('deve truncar descrição muito longa com line-clamp', () => {
      const longDescription = 'a'.repeat(200)
      const taskWithLongDescription = { ...mockTask, description: longDescription }

      render(<TaskCard task={taskWithLongDescription} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      const descriptionElement = screen.getByText(longDescription)
      expect(descriptionElement).toHaveClass('line-clamp-2')
    })
  })

  describe('Validação de Integração com Backend', () => {
    test('deve chamar refreshTasks quando modal é fechada após edição', async () => {
      axios.patch.mockResolvedValueOnce({ data: { message: 'Tarefa atualizada com sucesso' } })

      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      // Abrir modal
      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      // Fechar modal
      const closeButton = screen.getByRole('button', { name: /Fechar/i })
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(mockRefreshTasks).toHaveBeenCalled()
      })
    })

    test('deve mostrar erro quando a API falha', async () => {
      axios.patch.mockRejectedValueOnce(new Error('Erro ao atualizar tarefa'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={mockRefreshTasks} />)

      // Abrir modal
      const editButton = screen.getByRole('button', { name: /Editar tarefa: Testar aplicativo/i })
      fireEvent.click(editButton)

      // Simular o envio do formulário que falhará
      const submitButton = screen.getByRole('button', { name: /Atualizar/i })
      fireEvent.click(submitButton)

      // Wait for any async operations
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Validação de Edge Cases', () => {
    test('deve lidar com usuário não encontrado na lista', () => {
      const emptyUsers = []
      render(<TaskCard task={mockTask} color="border-red-400" users={emptyUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('TI')).toBeInTheDocument()
    })

    test('deve lidar com refreshTasks nulo', () => {
      render(<TaskCard task={mockTask} color="border-red-400" users={mockUsers} refreshTasks={null} />)

      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('TI')).toBeInTheDocument()
    })

    test('deve manter funcionalidade quando color não é fornecida', () => {
      render(<TaskCard task={mockTask} users={mockUsers} refreshTasks={mockRefreshTasks} />)

      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('TI')).toBeInTheDocument()
    })
  })
})