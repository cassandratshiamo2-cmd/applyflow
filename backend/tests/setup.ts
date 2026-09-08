import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ userId: 'user-1' })),
  sign: jest.fn(),
}));
