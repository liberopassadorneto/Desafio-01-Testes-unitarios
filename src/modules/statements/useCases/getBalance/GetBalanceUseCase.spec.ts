import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    inMemoryUsersRepository = new InMemoryUsersRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance to a new user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.statement).toEqual([]);
    expect(balance.balance).toEqual(0);
  });

  it("should be able to get balance to a user with a deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const deposit = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    await inMemoryStatementsRepository.create(deposit);

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.balance).toEqual(deposit.amount);
    expect(balance.statement.length).toEqual(1);
    expect(balance.statement[0].amount).toEqual(deposit.amount);
    expect(balance.statement[0].type).toEqual(deposit.type);
    expect(balance.statement[0].description).toEqual(deposit.description);
    expect(balance.statement[0]).toHaveProperty("id");
  });

  it("should be able to get balance to a user with a withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const deposit = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    await inMemoryStatementsRepository.create(deposit);

    const withdraw = {
      user_id: user.id,
      type: "withdraw",
      amount: 100,
      description: "Withdraw",
    } as ICreateStatementDTO;

    await inMemoryStatementsRepository.create(withdraw);

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.balance).toEqual(deposit.amount - withdraw.amount);
    expect(balance.statement.length).toEqual(2);
    expect(balance.statement[0].amount).toEqual(deposit.amount);
    expect(balance.statement[0].type).toEqual(deposit.type);
    expect(balance.statement[0].description).toEqual(deposit.description);
    expect(balance.statement[0]).toHaveProperty("id");
    expect(balance.statement[1].amount).toEqual(withdraw.amount);
    expect(balance.statement[1].type).toEqual(withdraw.type);
    expect(balance.statement[1].description).toEqual(withdraw.description);
    expect(balance.statement[1]).toHaveProperty("id");
  });

  it("should not be able to get balance to a non-existing user", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "non-existing-user" })
    ).rejects.toEqual(new GetBalanceError());
  });
});
