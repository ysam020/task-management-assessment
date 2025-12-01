import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDate,
} from "../utils/jwt";
import { UnauthorizedError, ConflictError } from "../utils/errors";
import { config, prisma } from "../config/index";
import { RegisterInput, LoginInput } from "../utils/validations";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse extends AuthTokens {
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokensForUser(user.id, user.email);

    return {
      ...tokens,
      user: {
        ...user,
        id: user.id,
      },
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate tokens
    const tokens = await this.generateTokensForUser(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    // Check if refresh token exists in database and is not expired
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedError("Refresh token expired");
    }

    // Verify user still exists
    if (!storedToken.user) {
      throw new UnauthorizedError("User not found");
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    return this.generateTokensForUser(
      storedToken.userId,
      storedToken.user.email
    );
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async getCurrentUser(userId: number): Promise<{
    id: number;
    email: string;
    name: string | null;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return user;
  }

  private async generateTokensForUser(
    userId: number,
    email: string
  ): Promise<AuthTokens> {
    const payload = { userId, email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const expiresAt = getTokenExpiryDate(config.jwt.refreshExpiry);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}

export default new AuthService();
