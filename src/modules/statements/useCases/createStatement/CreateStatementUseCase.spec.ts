import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "aaa@aaa.com",
      password: "123456",
    });

    const deposit = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    const result = await createStatementUseCase.execute(deposit);

    expect(result).toHaveProperty("id");
    expect(result.user_id).toEqual(deposit.user_id);
    expect(result.type).toEqual(deposit.type);
    expect(result.amount).toEqual(deposit.amount);
    expect(result.description).toEqual(deposit.description);
  });

  it("should not be able to create a deposit statement with a non-existent user", async () => {
    const deposit = {
      user_id: "123456",
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    await expect(createStatementUseCase.execute(deposit)).rejects.toEqual(
      new CreateStatementError.UserNotFound()
    );
  });

  it("should be able to create a withdraw statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "aaa@aaa.com",
      password: "123456",
    });

    const deposit = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(deposit);

    const withdraw = {
      user_id: user.id,
      type: "withdraw",
      amount: 50,
      description: "Withdraw",
    } as ICreateStatementDTO;

    const result = await createStatementUseCase.execute(withdraw);

    expect(result).toHaveProperty("id");
    expect(result.user_id).toEqual(withdraw.user_id);
    expect(result.type).toEqual(withdraw.type);
    expect(result.amount).toEqual(withdraw.amount);
    expect(result.description).toEqual(withdraw.description);
  });

  it("should not be able to create a withdraw statement with a non-existent user", async () => {
    const withdraw = {
      user_id: "123456",
      type: "withdraw",
      amount: 100,
      description: "Withdraw",
    } as ICreateStatementDTO;

    await expect(createStatementUseCase.execute(withdraw)).rejects.toEqual(
      new CreateStatementError.UserNotFound()
    );
  });

  it("should not be able to create a withdraw statement with insufficient funds", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "aaa@aaa.com",
      password: "123456",
    });

    const deposit = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Deposit",
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(deposit);

    const withdraw = {
      user_id: user.id,
      type: "withdraw",
      amount: 150,
      description: "Withdraw",
    } as ICreateStatementDTO;

    await expect(createStatementUseCase.execute(withdraw)).rejects.toEqual(
      new CreateStatementError.InsufficientFunds()
    );
  });
});
