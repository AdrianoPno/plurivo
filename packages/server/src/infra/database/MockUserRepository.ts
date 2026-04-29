import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

// Hash bcrypt válido para a senha "password123" (gerado com saltRounds=10)
const MOCK_USER_PASSWORD_HASH =
  "$2b$10$sGU2a0Hq4j9.B.6h/j5p5.eZg2b6p2aX8c.Y2b.8h/j5p5.eZg2b6";

export class MockUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Simula a busca de um usuário no banco de dados
    if (email === "test@example.com") {
      return new User({
        id: "user-123",
        email: "test@example.com",
        passwordHash: MOCK_USER_PASSWORD_HASH,
      });
    }

    return null;
  }
}
