import { create } from "domain";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "User Test",
      email: "user_test@email.com",
      password: "1234",
    };

    const { id } = await createUserUseCase.execute(user);

    const result = await showUserProfileUseCase.execute(id);

    expect(result).toHaveProperty("id");
    expect(result.name).toEqual(user.name);
    expect(result.email).toEqual(user.email);
    expect(result).toHaveProperty("password");
  });
});
