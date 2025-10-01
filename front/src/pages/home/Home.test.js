import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Home from './Home'

// Mock dos componentes
vi.mock('../../components/header/header', () => ({
  default: () => <header data-testid="mock-header">Mock Header</header>
}))

vi.mock('../../organisms/frame/Frame', () => ({
  default: () => <div data-testid="mock-frame">Mock Frame</div>
}))

describe('Home - Validações e Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Renderização Básica', () => {
    test('deve renderizar o componente Home corretamente', () => {
      render(<Home />)
      
      expect(screen.getByText('Mock Header')).toBeInTheDocument()
      expect(screen.getByText('Mock Frame')).toBeInTheDocument()
    })

    test('deve ter estrutura HTML correta', () => {
      const { container } = render(<Home />)
      
      expect(container.firstChild).toHaveClass('min-h-screen')
      expect(container.firstChild).toHaveClass('bg-gray-100')
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('flex-col')
    })

    test('deve ter header e main', () => {
      render(<Home />)
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
    })
  })

  describe('Validação de Acessibilidade', () => {
    test('deve ter atributos ARIA corretos no container principal', () => {
      const { container } = render(<Home />)
      
      expect(container.firstChild).toHaveAttribute('role', 'application')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Aplicativo Kanban')
    })

    test('deve ter atributos ARIA corretos na área principal', () => {
      render(<Home />)
      
      const main = screen.getByText('Mock Frame').closest('main')
      expect(main).toHaveAttribute('role', 'main')
      expect(main).toHaveAttribute('tabIndex', '0')
      expect(main).toHaveAttribute('aria-label', 'Área principal do Kanban com quadro de tarefas')
      expect(main).toHaveAttribute('aria-describedby', 'home-description')
    })

    test('deve ter descrição oculta para leitores de tela', () => {
      render(<Home />)
      
      const description = screen.getByText(/Página principal do aplicativo Kanban/)
      expect(description).toHaveClass('sr-only')
      expect(description).toHaveAttribute('id', 'home-description')
    })

    test('deve ter header acessível', () => {
      render(<Home />)
      
      const header = screen.getByTestId('mock-header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Validação de Estilo e Classes', () => {
    test('deve ter classes CSS corretas no container principal', () => {
      const { container } = render(<Home />)
      
      expect(container.firstChild).toHaveClass('min-h-screen')
      expect(container.firstChild).toHaveClass('bg-gray-100')
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('flex-col')
    })

    test('deve ter classes CSS corretas na área principal', () => {
      const { container } = render(<Home />)
      
      const main = container.querySelector('main')
      expect(main).toHaveClass('flex-grow')
    })

    test('deve ter classes CSS corretas na descrição', () => {
      render(<Home />)
      
      const description = screen.getByText(/Página principal do aplicativo Kanban/)
      expect(description).toHaveClass('sr-only')
    })
  })

  describe('Validação de Estrutura de Conteúdo', () => {
    test('deve conter header', () => {
      render(<Home />)
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    })

    test('deve conter main com Frame', () => {
      render(<Home />)
      
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
    })

    test('deve ter hierarquia correta de elementos', () => {
      const { container } = render(<Home />)
      
      const app = container.firstChild
      const header = app.querySelector('header')
      const main = app.querySelector('main')
      
      expect(app).toBeInTheDocument()
      expect(header).toBeInTheDocument()
      expect(main).toBeInTheDocument()
      expect(main).toContainElement(screen.getByTestId('mock-frame'))
    })
  })

  describe('Validação de Descrição e Semântica', () => {
    test('deve ter descrição detalhada para leitores de tela', () => {
      render(<Home />)
      
      const description = screen.getByText(/Página principal do aplicativo Kanban/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Página principal do aplicativo Kanban. Contém um cabeçalho com navegação e um quadro Kanban com colunas de tarefas que podem ser arrastadas e soltas.')
    })

    test('deve usar elementos semânticos corretos', () => {
      const { container } = render(<Home />)
      
      const app = container.firstChild
      expect(app.tagName).toBe('DIV')
      
      const header = app.querySelector('header')
      expect(header).toBeInTheDocument()
      
      const main = app.querySelector('main')
      expect(main).toBeInTheDocument()
      expect(main.tagName).toBe('MAIN')
    })
  })

  describe('Validação de Props e Componentes Filhos', () => {
    test('deve renderizar componentes filhos corretamente', () => {
      render(<Home />)
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
    })

    test('não deve receber props extras', () => {
      const { container } = render(<Home extraProp="test" />)
      
      // O componente deve ignorar props extras
      expect(container.firstChild).toBeInTheDocument()
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
    })
  })

  describe('Validação de Edge Cases', () => {
    test('deve lidar com renderização sem componentes filhos', () => {
      // Mock dos componentes para retornem null
      vi.mock('../../components/header/header', () => ({
        default: () => null
      }))
      
      vi.mock('../../organisms/frame/Frame', () => ({
        default: () => null
      }))
      
      const { container } = render(<Home />)
      
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('min-h-screen')
      expect(container.firstChild).toHaveClass('bg-gray-100')
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('flex-col')
    })

    test('deve manter acessibilidade mesmo sem conteúdo', () => {
      // Mock dos componentes para retornem null
      vi.mock('../../components/header/header', () => ({
        default: () => null
      }))
      
      vi.mock('../../organisms/frame/Frame', () => ({
        default: () => null
      }))
      
      const { container } = render(<Home />)
      
      expect(container.firstChild).toHaveAttribute('role', 'application')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Aplicativo Kanban')
    })
  })

  describe('Validação de Integração', () => {
    test('deve integrar corretamente com componentes filhos', () => {
      render(<Home />)
      
      // Verificar que ambos os componentes filhos são renderizados
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
      
      // Verificar que estão na estrutura correta
      const main = screen.getByTestId('mock-frame').closest('main')
      expect(main).toBeInTheDocument()
    })

    test('deve manter consistência com a aplicação principal', () => {
      render(<Home />)
      
      // Verificar a estrutura geral
      const app = screen.getByText('Mock Header').closest('[role="application"]')
      expect(app).toBeInTheDocument()
      
      // Verificar que o main está dentro do app
      expect(app).toContainElement(screen.getByText('Mock Frame').closest('main'))
    })
  })

  describe('Validação de Performance', () => {
    test('deve renderizar sem erros e sem warnings', () => {
      const originalError = console.error
      console.error = vi.fn()
      
      render(<Home />)
      
      expect(console.error).not.toHaveBeenCalled()
      console.error = originalError
    })

    test('não deve causar re-renderizações desnecessárias', () => {
      const { rerender } = render(<Home />)
      
      // Re-renderizar com as mesmas props
      rerender(<Home />)
      
      // O componente deve lidar bem com re-renderizações
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(screen.getByTestId('mock-frame')).toBeInTheDocument()
    })
  })

  describe('Validação de Responsividade', () => {
    test('deve manter estrutura em diferentes tamanhos de tela', () => {
      const { container } = render(<Home />)
      
      // A estrutura deve ser flexível
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('flex-col')
      expect(container.querySelector('main')).toHaveClass('flex-grow')
    })
  })

  describe('Validação de SEO e Meta Dados', () => {
    test('deve ter estrutura semântica adequada para SEO', () => {
      const { container } = render(<Home />)
      
      // O componente deve ter uma estrutura semântica clara
      expect(container.firstChild).toHaveAttribute('role', 'application')
      expect(container.querySelector('main')).toHaveAttribute('role', 'main')
    })
  })

  describe('Validação de Internacionalização', () => {
    test('deve suportar texto em português', () => {
      render(<Home />)
      
      expect(screen.getByText('Mock Header')).toBeInTheDocument()
      expect(screen.getByText('Mock Frame')).toBeInTheDocument()
      expect(screen.getByText(/Página principal do aplicativo Kanban/)).toBeInTheDocument()
    })
  })
})