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
    name: string;
    role: string;
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

    // Create user with role
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "INTERVIEWER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokensForUser(
      user.id,
      user.email,
      user.role
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    const tokens = await this.generateTokensForUser(
      user.id,
      user.email,
      user.role
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    );
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokensForUser(
    userId: number,
    email: string,
    role: string
  ): Promise<AuthTokens> {
    const payload = { userId, email, role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    const expiresAt = getTokenExpiryDate(config.jwt.refreshExpiry);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
