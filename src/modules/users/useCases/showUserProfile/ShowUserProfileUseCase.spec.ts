import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "User Test",
      email: "user_test@email.com",
      password: "1234",
    };

    const { id } = await inMemoryUsersRepository.create(user);

    const result = await showUserProfileUseCase.execute(id);

    expect(result).toHaveProperty("id");
    expect(result.name).toEqual(user.name);
    expect(result.email).toEqual(user.email);
    expect(result).toHaveProperty("password");
  });

  it("should not be able to show user profile if user does not exists", async () => {
    await expect(
      showUserProfileUseCase.execute("non-existent-user-id")
    ).rejects.toEqual(new ShowUserProfileError());
  });
});
