import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a deposit statement operation", async () => {
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

    const depositStatement = await inMemoryStatementsRepository.create(deposit);

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: depositStatement.id,
    });

    expect(result).toHaveProperty("id");
    expect(result.user_id).toEqual(deposit.user_id);
    expect(result.type).toEqual(deposit.type);
    expect(result.amount).toEqual(deposit.amount);
    expect(result.description).toEqual(deposit.description);
  });

  it("should be able to get a withdraw statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const withdraw = {
      user_id: user.id,
      type: "withdraw",
      amount: 50,
      description: "Withdraw",
    } as ICreateStatementDTO;

    const withdrawStatement = await inMemoryStatementsRepository.create(
      withdraw
    );

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: withdrawStatement.id,
    });

    expect(result).toHaveProperty("id");
    expect(result.user_id).toEqual(withdraw.user_id);
    expect(result.type).toEqual(withdraw.type);
    expect(result.amount).toEqual(withdraw.amount);
    expect(result.description).toEqual(withdraw.description);
  });

  it("should not be able to get a statement operation with a non-existent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: "123456",
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get a statement operation with a non-existent statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "123456",
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
