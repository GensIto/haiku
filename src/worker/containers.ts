import { DatabaseProvider, DatabaseProviderToken, db } from "@/worker/db";
import { IUsersRepository } from "@/worker/domain/interface/repositories/IUsersRepository";
import { IUsersUsecase } from "@/worker/domain/interface/usecase/IUsersUsecase";
import { IVersesRepository } from "@/worker/domain/interface/repositories/IVersesRepository";
import { IDangosRepository } from "@/worker/domain/interface/repositories/IDangosRepository";
import {
  ICreateVerseUseCase,
  IFindVerseByIdUseCase,
  IFindVersesByUserUseCase,
  IFindAllVersesUseCase,
  IFindVersesByTypeUseCase,
  IUpdateVerseUseCase,
  IDeleteVerseUseCase,
} from "@/worker/domain/interface/usecase/verses";
import { UsersRepository } from "@/worker/infrastructure/UsersRepository";
import { VersesRepository } from "@/worker/infrastructure/VersesRepository";
import { DangosRepository } from "@/worker/infrastructure/DangosRepository";
import { UsersUsecase } from "@/worker/usecase/UsersUsecase";
import {
  CreateVerseUseCase,
  FindVerseByIdUseCase,
  FindVersesByUserUseCase,
  FindAllVersesUseCase,
  FindVersesByTypeUseCase,
  UpdateVerseUseCase,
  DeleteVerseUseCase,
} from "@/worker/usecase/verses";
import { AddDangoUseCase } from "@/worker/usecase/dangos/AddDangoUseCase";
import { RemoveDangoUseCase } from "@/worker/usecase/dangos/RemoveDangoUseCase";
import { container } from "tsyringe";
import { ContextProvider } from "@/worker/infrastructure/providers/ContextProvider";
import { IKigoDetectionService } from "@/worker/domain/interface/service/KigoDetectionService";
import { KigoDetectionService } from "@/worker/domain/service/KigoDetectionService";
import {
  IMoraCounterService,
  MoraCounterService,
} from "@/worker/service/MoraCounterService";
import { IFindLatestVersesUseCase } from "@/worker/domain/interface/usecase/verses/IFindLatestVersesUseCase";
import { FindLatestVersesUseCase } from "@/worker/usecase/verses/FindLatestVersesUseCase";

// Database Provider
container.register<DatabaseProvider>(DatabaseProviderToken, { useValue: db });

// Repositories
container.register<IUsersRepository>("IUsersRepository", {
  useClass: UsersRepository,
});

container.register<IVersesRepository>("IVersesRepository", {
  useClass: VersesRepository,
});

container.register<IDangosRepository>("IDangosRepository", {
  useClass: DangosRepository,
});

// UseCases - Users
container.register<IUsersUsecase>("IUsersUsecase", {
  useClass: UsersUsecase,
});

// UseCases - Verses
container.register<ICreateVerseUseCase>("ICreateVerseUseCase", {
  useClass: CreateVerseUseCase,
});

container.register<IFindVerseByIdUseCase>("IFindVerseByIdUseCase", {
  useClass: FindVerseByIdUseCase,
});

container.register<IFindVersesByUserUseCase>("IFindVersesByUserUseCase", {
  useClass: FindVersesByUserUseCase,
});

container.register<IFindAllVersesUseCase>("IFindAllVersesUseCase", {
  useClass: FindAllVersesUseCase,
});

container.register<IFindLatestVersesUseCase>("IFindLatestVersesUseCase", {
  useClass: FindLatestVersesUseCase,
});

container.register<IFindVersesByTypeUseCase>("IFindVersesByTypeUseCase", {
  useClass: FindVersesByTypeUseCase,
});

container.register<IUpdateVerseUseCase>("IUpdateVerseUseCase", {
  useClass: UpdateVerseUseCase,
});

container.register<IDeleteVerseUseCase>("IDeleteVerseUseCase", {
  useClass: DeleteVerseUseCase,
});

// UseCases - Dangos
container.register("AddDangoUseCase", {
  useClass: AddDangoUseCase,
});

container.register("RemoveDangoUseCase", {
  useClass: RemoveDangoUseCase,
});

// Providers
container.registerSingleton("IContextProvider", ContextProvider);

// Services
container.register<IKigoDetectionService>("IKigoDetectionService", {
  useClass: KigoDetectionService,
});

container.register<IMoraCounterService>("IMoraCounterService", {
  useClass: MoraCounterService,
});
