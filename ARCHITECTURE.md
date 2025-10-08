# Arquitectura del Proyecto - Clean Architecture

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Estructura de Capas](#estructura-de-capas)
3. [Flujo de Datos](#flujo-de-datos)
4. [Evaluación de Clean Architecture](#evaluación-de-clean-architecture)
5. [Escalabilidad](#escalabilidad)
6. [Recomendaciones](#recomendaciones)

---

## Visión General

Este proyecto implementa **Clean Architecture** en un backend NestJS con TypeScript. La arquitectura se organiza en 4 capas principales siguiendo el principio de **Dependency Inversion** y **Separation of Concerns**.

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  (Controllers, DTOs, Modules, HTTP Layer)              │
│                         ↓                               │
│                    APPLICATION                          │
│         (Use Cases, Business Logic)                     │
│                         ↓                               │
│                      DOMAIN                             │
│     (Entities, Repository Interfaces)                   │
│                         ↑                               │
│                  INFRASTRUCTURE                         │
│  (Repository Implementations, Database, External APIs)  │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura de Capas

### 1. 📦 **Domain Layer** (`src/domain/`)

**Propósito**: Contiene la lógica de negocio central y las reglas empresariales independientes de frameworks.

```
domain/
├── entities/              # Entidades de dominio (Plain TypeScript)
│   ├── categorie/
│   │   └── categorie.entity.ts
│   └── garage/
│       └── garage.entity.ts
└── repositories/          # Interfaces de repositorios (Abstracciones)
    ├── categorie.repository.ts
    └── garage.repository.ts
```

**Características**:
- ✅ **Entidades puras**: Solo TypeScript classes sin decoradores de frameworks
- ✅ **Interfaces de repositorio**: Definen contratos sin implementación
- ✅ **Sin dependencias externas**: No depende de otras capas

**Ejemplo**:
```typescript
// domain/entities/categorie/categorie.entity.ts
export class Categorie {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly code: string,
    public readonly status: boolean,
  ) {}
}

// domain/repositories/categorie.repository.ts
export interface CategorieRepository {
  create(tool: Omit<Categorie, "uuid">): Promise<Categorie>;
  findAll(page: number, limit: number): Promise<{ categories: Categorie[]; total: number }>;
  findByUuid(uuid: string): Promise<Categorie | null>;
  update(uuid: string, tool: Partial<Omit<Categorie, "uuid">>): Promise<Categorie | null>;
  delete(uuid: string): Promise<boolean>;
}
```

---

### 2. ⚙️ **Application Layer** (`src/application/`)

**Propósito**: Orquesta el flujo de datos y coordina las operaciones de negocio.

```
application/
├── services/              # Servicios de aplicación (vacío actualmente)
└── use-cases/             # Casos de uso organizados por módulo
    ├── categorie/
    │   ├── create-categorie.use-case.ts
    │   ├── delete-categorie.use-case.ts
    │   ├── get-categorie-by-id.use-case.ts
    │   ├── get-categories.use-case.ts
    │   ├── update-categorie.use-case.ts
    │   └── exports-provider.use-case.ts  # Provider para NestJS
    └── garage/
        ├── create-garage.use-case.ts
        ├── delete-garage.use-case.ts
        ├── get-garage-by-id.use-case.ts
        ├── get-garages.use-case.ts
        ├── update-garage.use-case.ts
        └── exports.provider.use-case.ts
```

**Características**:
- ✅ **Organización por módulo**: Cada módulo de negocio tiene su carpeta de use cases
- ✅ **Dependency Injection**: Usa `@Inject()` para recibir repositorios por interfaz
- ✅ **Lógica de negocio**: Validaciones y reglas de negocio antes de delegar a repositorios
- ✅ **Independencia de frameworks**: Solo depende del dominio

**Ejemplo**:
```typescript
@Injectable()
export class CreateCategorieUseCase {
  constructor(
    @Inject('CategorieRepository')
    private readonly categorieRepository: CategorieRepository,
  ) {}

  async execute(name: string, code: string, status: boolean = true): Promise<Categorie> {
    // Validación de negocio
    const existingCategorie = await this.categorieRepository.findAll(1, 1000);
    const codeExists = existingCategorie.categories.some(
      (categorie) => categorie.code === code,
    );

    if (codeExists) {
      throw new Error('Ya existe una categoría con este código');
    }

    return await this.categorieRepository.create({ name, code, status });
  }
}
```

---

### 3. 🔧 **Infrastructure Layer** (`src/infrastructure/`)

**Propósito**: Implementa los detalles técnicos y conexiones con sistemas externos.

```
infrastructure/
├── database/
│   ├── database.module.ts         # Configuración de TypeORM
│   └── entities/                  # Entidades de TypeORM (con decoradores)
│       ├── categorie.entity.ts
│       └── garage.entity.ts
├── repositories/                  # Implementaciones concretas
│   ├── api-categorie.repository.ts
│   └── mysql-garage.repository.ts
└── services/                      # Servicios externos (vacío actualmente)
```

**Características**:
- ✅ **Implementa interfaces de dominio**: `ApiCategorieRepository implements CategorieRepository`
- ✅ **Separación de entidades**: 
  - Entidades de dominio (puras)
  - Entidades de base de datos (con decoradores TypeORM)
- ✅ **Mapeo**: Convierte entidades de DB a entidades de dominio
- ✅ **Acceso a datos**: TypeORM para MySQL

**Ejemplo**:
```typescript
@Injectable()
export class ApiCategorieRepository implements CategorieRepository {
  constructor(
    @InjectRepository(CategorieEntity)
    private readonly categorieRepository: Repository<CategorieEntity>,
  ) {}

  async create(categorie: Omit<Categorie, 'uuid'>): Promise<Categorie> {
    const categorieEntity = this.categorieRepository.create(categorie);
    const savedCategorie = await this.categorieRepository.save(categorieEntity);
    
    // Mapeo de entidad de DB a entidad de dominio
    return new Categorie(
      savedCategorie.uuid,
      savedCategorie.name,
      savedCategorie.code,
      savedCategorie.status,
    );
  }
  // ... otros métodos
}
```

---

### 4. 🎯 **Presentation Layer** (`src/presentation/`)

**Propósito**: Maneja la comunicación con el mundo exterior (HTTP/REST).

```
presentation/
├── controllers/           # Controladores organizados por módulo
│   ├── categorie/
│   │   └── categorie.controller.ts
│   └── garage/
│       └── garage.controller.ts
├── dtos/                  # Data Transfer Objects
│   ├── categorie/
│   │   └── create-categorie.dto.ts
│   └── garage/
│       ├── create-garage.dto.ts
│       └── update-garage.dto.ts
└── modules/               # Módulos de NestJS
    ├── categorie.module.ts
    └── garage.module.ts
```

**Características**:
- ✅ **Controllers delgados**: Solo reciben requests y delegan a use cases
- ✅ **DTOs para validación**: Validación de entrada con `class-validator`
- ✅ **Módulos NestJS**: Configuran DI y conectan todas las capas
- ✅ **Respuestas estandarizadas**: Formato consistente `{ success, message, data }`

**Ejemplo**:
```typescript
@Controller('categorie')
export class CategorieController {
  constructor(
    private readonly createCategorieUseCase: CreateCategorieUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    // ... otros use cases
  ) {}

  @Post('create')
  async create(@Body(ValidationPipe) createCategorieDto: CreateCategorieDto) {
    const categorie = await this.createCategorieUseCase.execute(
      createCategorieDto.name,
      createCategorieDto.code,
      createCategorieDto.status ?? true,
    );
    return {
      success: true,
      message: 'Categoria creada exitosamente',
      data: categorie,
    };
  }
}
```

**Módulo NestJS**:
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([CategorieEntity])],
  controllers: [CategorieController],
  providers: [
    ...CATEGORIE_USE_CASES,  // Array de use cases
    {
      provide: 'CategorieRepository',
      useClass: ApiCategorieRepository,  // Inyección de implementación
    },
  ],
})
export class CategorieModule {}
```

---

### 5. 🔄 **Shared Layer** (`src/shared/`)

**Propósito**: Componentes compartidos entre capas.

```
shared/
└── filters/              # Exception filters globales
```

---

## Flujo de Datos

### Ejemplo: Crear una Categoría

```
1. HTTP Request
   POST /categorie/create
   Body: { name: "Herramientas", code: "TOOLS", status: true }
         ↓
2. Presentation Layer
   CategorieController recibe el request
   Valida el DTO con ValidationPipe
         ↓
3. Application Layer
   CreateCategorieUseCase.execute()
   - Valida reglas de negocio (código único)
   - Llama al repositorio
         ↓
4. Domain Layer
   CategorieRepository (interface)
         ↓
5. Infrastructure Layer
   ApiCategorieRepository.create()
   - Crea entidad de TypeORM
   - Guarda en MySQL
   - Mapea a entidad de dominio
         ↓
6. Response
   { success: true, message: "...", data: Categorie }
```

### Diagrama de Dependencias

```
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │ depende de
       ↓
┌─────────────┐
│  Use Case   │
└──────┬──────┘
       │ depende de
       ↓
┌─────────────────┐
│ Repository      │ ← Interface (Domain)
│ (Interface)     │
└─────────────────┘
       ↑
       │ implementa
┌──────────────────┐
│ ApiRepository    │
│ (Infrastructure) │
└──────────────────┘
```

---

## Evaluación de Clean Architecture

### ✅ **Puntos Fuertes - Muy Bien Implementado**

1. **✅ Separación de Capas Clara**
   - Cada capa tiene su propósito bien definido
   - Estructura de carpetas refleja fielmente las capas de Clean Architecture

2. **✅ Dependency Inversion Principle (DIP)**
   - Use cases dependen de interfaces (`CategorieRepository`)
   - Implementaciones concretas se inyectan en tiempo de ejecución
   - El dominio no conoce la infraestructura

3. **✅ Entidades de Dominio Puras**
   - Sin decoradores de frameworks
   - Lógica de negocio encapsulada
   - Separadas de entidades de base de datos

4. **✅ Use Cases Bien Definidos**
   - Cada operación es un use case independiente
   - Un use case = una responsabilidad (SRP)
   - Organizados por módulo de negocio

5. **✅ Mapeo entre Capas**
   - Convierte entidades de DB a entidades de dominio
   - Mantiene la separación de concerns

6. **✅ Organización por Módulos de Negocio**
   - `categorie/` y `garage/` agrupan toda la funcionalidad
   - Fácil de ubicar y mantener el código relacionado

### 🟡 **Áreas de Mejora**

1. **🟡 Manejo de Errores**
   ```typescript
   // Actual
   throw new Error('Ya existe una categoría con este código');
   
   // Recomendado: Excepciones de dominio personalizadas
   throw new DuplicatedCategorieCodeError(code);
   ```
   
   **Sugerencia**: Crear excepciones de dominio en `domain/exceptions/`
   - `DuplicatedCategorieCodeError`
   - `CategorieNotFoundError`
   - `InvalidCategorieDataError`

2. **🟡 Validación en Use Cases**
   ```typescript
   // Actual: Obtiene todas las categorías (1000 registros)
   const existingCategorie = await this.categorieRepository.findAll(1, 1000);
   ```
   
   **Sugerencia**: Agregar método específico en el repositorio
   ```typescript
   // domain/repositories/categorie.repository.ts
   existsByCode(code: string): Promise<boolean>;
   ```

3. **🟡 Value Objects**
   ```typescript
   // Actual: Primitivos (string, boolean)
   
   // Recomendado: Value Objects para validación
   class CategorieCode {
     constructor(private value: string) {
       if (!value.match(/^[A-Z0-9_]+$/)) {
         throw new InvalidCategorieCodeError(value);
       }
     }
     getValue(): string { return this.value; }
   }
   ```

4. **🟡 DTOs vs Entidades**
   - Los DTOs se están reutilizando para update
   - Crear `UpdateCategorieDto` específico sería más semántico

5. **🟡 Paginación**
   - Considera crear un `PaginationResult<T>` genérico en shared
   - Estandarizar respuestas paginadas en toda la app

6. **🟡 Logs y Observabilidad**
   - Agregar logging en use cases críticos
   - Implementar métricas de negocio

### ⚠️ **Consideraciones**

1. **Testing**
   - La arquitectura facilita el testing (dependency injection)
   - Faltan tests unitarios para use cases (mockeando repositorios)
   - Faltan tests de integración

2. **Documentación**
   - Agregar JSDoc en interfaces de repositorio
   - Documentar casos de uso complejos

---

## Escalabilidad

### 🚀 **Muy Escalable - 9/10**

Tu arquitectura está **muy bien preparada para escalar**:

#### ✅ **Escalabilidad Horizontal**
- Módulos independientes (`categorie`, `garage`)
- Fácil agregar nuevos módulos sin afectar existentes
- Cada módulo puede evolucionar independientemente

#### ✅ **Escalabilidad Técnica**
- **Cambiar de base de datos**: Solo modificar `infrastructure/repositories/`
- **Agregar caché**: Implementar `CachedCategorieRepository` que decoré el existente
- **Microservicios**: Cada módulo puede extraerse a su propio servicio
- **API Gateway**: Controllers pueden migrar a otro proyecto sin cambiar lógica

#### ✅ **Escalabilidad de Equipo**
- Múltiples devs pueden trabajar en módulos distintos sin conflictos
- Nuevos desarrolladores entienden la estructura rápidamente
- Código predecible y consistente

#### ✅ **Mantenibilidad**
- Cambios localizados: bug en categorías → solo tocas `categorie/`
- Refactoring seguro: cambios en infraestructura no afectan lógica
- Testing fácil: mockear repositorios en tests de use cases

### 📈 **Camino para Escalar**

```
Fase 1 (Actual)
- Monolito modular
- Todos los módulos en un proyecto

Fase 2 (Fácil transición)
- Separar módulos en librerías npm
- Shared kernel para tipos comunes

Fase 3 (Microservicios)
- Cada módulo → servicio independiente
- Event-driven entre servicios
- API Gateway enfrente

Fase 4 (DDD Avanzado)
- Bounded Contexts bien definidos
- Eventos de dominio
- CQRS si es necesario
```

---

## Recomendaciones

### 🎯 **Prioridad Alta**

1. **Agregar Tests**
   ```
   tests/
   ├── unit/
   │   └── use-cases/
   │       └── categorie/
   │           └── create-categorie.use-case.spec.ts
   └── integration/
       └── repositories/
           └── api-categorie.repository.spec.ts
   ```

2. **Excepciones de Dominio**
   ```typescript
   // domain/exceptions/categorie.exceptions.ts
   export class CategorieNotFoundError extends Error {
     constructor(uuid: string) {
       super(`Categorie with uuid ${uuid} not found`);
       this.name = 'CategorieNotFoundError';
     }
   }
   ```

3. **Global Exception Filter**
   ```typescript
   // shared/filters/http-exception.filter.ts
   @Catch()
   export class GlobalExceptionFilter implements ExceptionFilter {
     catch(exception: unknown, host: ArgumentsHost) {
       // Mapear excepciones de dominio a HTTP status codes
     }
   }
   ```

### 🎯 **Prioridad Media**

4. **Value Objects para Validación**
   ```typescript
   // domain/value-objects/categorie-code.vo.ts
   export class CategorieCode {
     private constructor(private readonly value: string) {}
     
     static create(code: string): CategorieCode {
       if (!code.match(/^[A-Z0-9_]{2,10}$/)) {
         throw new InvalidCategorieCodeError(code);
       }
       return new CategorieCode(code);
     }
   }
   ```

5. **Logger Service**
   ```typescript
   // shared/logger/logger.service.ts
   export class LoggerService {
     log(context: string, message: string, data?: any) {}
     error(context: string, error: Error, data?: any) {}
   }
   ```

6. **Configuración por Ambiente**
   ```typescript
   // shared/config/
   ├── app.config.ts
   ├── database.config.ts
   └── validation.config.ts
   ```

### 🎯 **Prioridad Baja**

7. **Event System**
   ```typescript
   // domain/events/categorie-created.event.ts
   export class CategorieCreatedEvent {
     constructor(public readonly categorie: Categorie) {}
   }
   ```

8. **CQRS (si la complejidad aumenta)**
   ```
   application/
   ├── commands/
   │   └── categorie/
   └── queries/
       └── categorie/
   ```

---

## Conclusión

### 📊 **Calificación General**

- **Implementación de Clean Architecture**: **9/10** ⭐
- **Escalabilidad**: **9/10** ⭐
- **Mantenibilidad**: **8.5/10** ⭐
- **Separación de Concerns**: **9.5/10** ⭐
- **Testabilidad**: **8/10** ⭐

### 💡 **Resumen**

Has implementado Clean Architecture **muy bien**. La separación de capas es clara, las dependencias apuntan hacia adentro correctamente, y la estructura es **altamente escalable y mantenible**.

**Puntos destacados**:
- ✅ Dependency Inversion bien aplicado
- ✅ Use cases encapsulados y reutilizables
- ✅ Entidades de dominio puras
- ✅ Infraestructura desacoplada
- ✅ Organización modular por dominio

**Próximos pasos recomendados**:
1. Tests unitarios de use cases
2. Excepciones de dominio personalizadas
3. Optimizar consultas de validación
4. Documentación con JSDoc
5. Global exception filter

**¡Excelente trabajo!** 🎉 Tu arquitectura está lista para crecer y mantener un proyecto a largo plazo.

---

## 📚 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
