import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock do axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock do createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (element) => element,
  }
})

// Mock do @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  Droppable: ({ children }) => children({ provided: { innerRef: () => {}, droppableProps: {} } }),
  Draggable: ({ children }) => children({ provided: { innerRef: () => {}, draggableProps: {}, dragHandleProps: {} } }, { isDragging: false }),
}))

// Mock dos ícones
vi.mock('react-icons/ai', () => ({
  AiOutlineClose: () => 'Close Icon',
  AiOutlineEdit: () => 'Edit Icon',
  AiOutlineDelete: () => 'Delete Icon',
  AiOutlinePlus: () => 'Plus Icon',
}))

vi.mock('react-icons/io5', () => ({
  IoDocumentTextOutline: () => 'Document Icon',
  IoCheckmarkDoneSharp: () => 'Check Icon',
}))

vi.mock('react-icons/pi', () => ({
  PiGearBold: () => 'Gear Icon',
}))