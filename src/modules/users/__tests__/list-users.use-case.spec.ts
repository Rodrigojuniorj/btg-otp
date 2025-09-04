import { Test, TestingModule } from '@nestjs/testing'
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailAndPassword: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUsersUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<ListUsersUseCase>(ListUsersUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return list of users successfully', async () => {
      const request = {}

      const mockUsers = [
        new User(
          1,
          'User 1',
          'user1@example.com',
          'hashedPassword1',
          new Date(),
          new Date(),
        ),
        new User(
          2,
          'User 2',
          'user2@example.com',
          'hashedPassword2',
          new Date(),
          new Date(),
        ),
      ]

      userRepository.findAll.mockResolvedValue(mockUsers)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        users: [
          {
            id: mockUsers[0].id,
            name: mockUsers[0].name,
            email: mockUsers[0].email,
            createdAt: mockUsers[0].createdAt,
            updatedAt: mockUsers[0].updatedAt,
          },
          {
            id: mockUsers[1].id,
            name: mockUsers[1].name,
            email: mockUsers[1].email,
            createdAt: mockUsers[1].createdAt,
            updatedAt: mockUsers[1].updatedAt,
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      })

      expect(userRepository.findAll).toHaveBeenCalled()
    })

    it('should return empty array when no users exist', async () => {
      const request = {}

      userRepository.findAll.mockResolvedValue([])

      const result = await useCase.execute(request)

      expect(result).toEqual({
        users: [],
        total: 0,
        page: 1,
        limit: 10,
      })

      expect(userRepository.findAll).toHaveBeenCalled()
    })
  })
})
