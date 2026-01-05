import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mosaic API',
      version: '1.0.0',
      description: 'API documentation for Mosaic - A productivity app with voice features',
      contact: {
        name: 'Ellie',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title', 'listType'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Task unique identifier',
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Buy groceries',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Task description',
              example: 'Milk, eggs, bread',
            },
            priority: {
              type: 'string',
              enum: ['URGENT', 'HIGH', 'MEDIUM', 'NORMAL', 'LOW'],
              default: 'NORMAL',
              description: 'Task priority level',
            },
            completed: {
              type: 'boolean',
              default: false,
              description: 'Task completion status',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Task due date',
            },
            listType: {
              type: 'string',
              enum: ['TODO', 'SHOPPING', 'CALENDAR'],
              description: 'Type of list the task belongs to',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp',
            },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'listType'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Buy groceries',
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Milk, eggs, bread',
            },
            priority: {
              type: 'string',
              enum: ['URGENT', 'HIGH', 'MEDIUM', 'NORMAL', 'LOW'],
              default: 'NORMAL',
            },
            completed: {
              type: 'boolean',
              default: false,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            listType: {
              type: 'string',
              enum: ['TODO', 'SHOPPING', 'CALENDAR'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/Server/routes/*.ts'], // Path to API routes
}

export const swaggerSpec = swaggerJsdoc(options)