import prisma from '../config/database.js';
import { comparePasswords, generateToken, hashPassword } from '../utils/utils.js';
// import { hashPassword, comparePasswords, generateToken } from '../utils/auth.js';

export async function createUser(userData) {
  const { email, username, password, firstName, lastName, role } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('User with this email already exists');
    }
    if (existingUser.username === username) {
      throw new Error('User with this username already exists');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || 'USER'
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function getAllUsers(options = {}) {
  const { page = 1, limit = 10, role, isActive } = options;
  const skip = (page - 1) * limit;

  const where = {};
  if (role) where.role = role;
  if (typeof isActive === 'boolean') where.isActive = isActive;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function updateUser(userId, updateData) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  // Check for conflicts if email or username is being updated
  if (updateData.email || updateData.username) {
    const conflicts = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              updateData.email ? { email: updateData.email } : {},
              updateData.username ? { username: updateData.username } : {}
            ].filter(condition => Object.keys(condition).length > 0)
          }
        ]
      }
    });

    if (conflicts) {
      if (conflicts.email === updateData.email) {
        throw new Error('User with this email already exists');
      }
      if (conflicts.username === updateData.username) {
        throw new Error('User with this username already exists');
      }
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return updatedUser;
}

export async function deleteUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: 'User deleted successfully' };
}

export async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  const isValidPassword = await comparePasswords(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
}

const userService = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
  authenticateUser
};

export default userService