import { findUserByEmail } from "@/lib/services/authService";
import { credentialsAuthorize } from "@/lib/services/credentialsAuthorize";
import bcrypt from "bcryptjs";

jest.mock("@/lib/services/authService", () => ({
  findUserByEmail: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

describe("credentialsAuthorize", () => {
  it("should throw error if email or password missing", async () => {
    await expect(credentialsAuthorize({ email: "", password: "" })).rejects.toThrow(
      "Missing email or password"
    );
  });

  it("should throw error if user not found", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      credentialsAuthorize({ email: "test@example.com", password: "password" })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw error if no password in user", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue({ id: "1", email: "test@example.com" });

    await expect(
      credentialsAuthorize({ email: "test@example.com", password: "password" })
    ).rejects.toThrow("No password");
  });

  it("should throw error if password is invalid", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashedpw",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      credentialsAuthorize({ email: "test@example.com", password: "wrongpassword" })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should return user if credentials are valid", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      username: "tester",
      password: "hashedpw",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const user = await credentialsAuthorize({ email: "test@example.com", password: "password" });

    expect(user).toEqual({
      id: "1",
      email: "test@example.com",
      username: "tester",
    });
  });
});
