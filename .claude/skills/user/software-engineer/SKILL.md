# Software Engineer Skill - TanStack Start + Effect Architecture

## Purpose
Guide Claude Code to implement features following a strict TanStack Start + Effect architecture with branded types, clean domain-driven design, and type safety.

## Technology Stack
- **Framework**: TanStack Start
- **Effect Runtime**: Effect 3.19
- **Language**: TypeScript (strict mode)
- **Architecture**: Clean Architecture with Domain-Driven Design

---

## Core Architectural Principles

### 1. Branded Types - MANDATORY
**All types MUST be branded and derived from Schema.**

```typescript
// ✅ CORRECT - Branded type from schema
export const NewsId = Schema.UUID.pipe(Schema.brand("NewsId"))
export type NewsId = typeof NewsId.Type

export const NewsTitle = Schema.String.pipe(
  Schema.minLength(1),
  Schema.maxLength(200),
  Schema.brand("NewsTitle")
)
export type NewsTitle = typeof NewsTitle.Type

// ❌ INCORRECT - Raw types
type NewsId = string
type NewsTitle = string
```

### 2. Type Safety - ABSOLUTE RULE
**NEVER use `any` or `undefined` directly.**

```typescript
// ✅ CORRECT - Explicit Option type
import { Option } from "effect"

const user: Option.Option<User> = Option.none()

// ✅ CORRECT - Explicit unknown for external data
function parseData(raw: unknown): Effect.Effect<Data, ParseError> {
  return Schema.decodeUnknown(DataSchema)(raw)
}

// ❌ INCORRECT - Using any
function processData(data: any) { }

// ❌ INCORRECT - Using undefined directly
let value: string | undefined
```

**Allowed alternatives:**
- `Option.Option<T>` for optional values
- `unknown` for untrusted external data
- `never` for impossible cases
- Explicit union types: `T | null`

---

## Feature Structure Template

For a feature named `{feature}`, create this exact structure:

```
src/features/{domain}/{feature}/
├── application/
│   └── {feature}.facade.ts           # Facade pattern - orchestrates domain logic
├── components/
│   ├── common/                        # Shared UI components (if needed)
│   │   └── *.tsx
│   ├── containers/                    # Smart components with data fetching
│   │   ├── {feature}-create-container.tsx
│   │   ├── {feature}-list-container.tsx
│   │   └── {feature}-update-container.tsx
│   ├── form/                          # Form components
│   │   ├── {feature}-menu.tsx
│   │   └── sections/
│   │       └── {feature}-form-*.tsx
│   ├── listeners/                     # Event listeners (snackbars, etc.)
│   │   └── {feature}-snackbar-listener.tsx
│   └── table/                         # Table components
│       ├── {feature}-row-actions.tsx
│       └── {feature}-table.tsx
├── context/
│   └── {feature}-runtime-context.tsx  # Effect runtime context
├── domain/
│   ├── index.ts                       # Public domain API
│   ├── {feature}.error-mapper.ts      # Maps errors to user-friendly messages
│   ├── {feature}.errors.ts            # Domain-specific errors
│   └── {feature}.event.ts             # Domain events
├── factory/
│   ├── codecs/                        # Data transformation
│   │   └── {feature}.*.form-to-api.codec.ts
│   ├── mappers/                       # Object mapping
│   │   └── {feature}-to-form.mapper.ts
│   └── payload/                       # Request payload builders
│       └── {feature}.*.payload.ts
├── hooks/
│   ├── forms/
│   │   └── use-{feature}-form.tsx     # Form state management
│   ├── mutations/
│   │   ├── use-create-{feature}.mutation.ts
│   │   ├── use-delete-{feature}.mutation.ts
│   │   └── use-update-{feature}.mutation.ts
│   ├── queries/
│   │   ├── index.ts
│   │   ├── use-{feature}-detail-query.ts
│   │   └── use-{feature}-list.ts
│   └── index.ts                       # Public hooks API
├── infrastructure/
│   ├── http/
│   │   └── services/
│   │       ├── {feature}.create.service.ts
│   │       ├── {feature}.delete.service.ts
│   │       ├── {feature}.details.service.ts
│   │       ├── {feature}.list.service.ts
│   │       └── {feature}.update.service.ts
│   ├── {feature}.layer.ts             # Effect Layer composition
│   └── query-keys/
│       └── {feature}.query-keys.ts
└── schema/
    ├── api/                           # API DTOs
    │   ├── {feature}.base.schema.ts
    │   ├── {feature}.create.schema.ts
    │   ├── {feature}.delete.schema.ts
    │   ├── {feature}.details.api.schema.ts
    │   ├── {feature}.list.schema.ts
    │   └── {feature}.update.schema.ts
    ├── form/                          # Form schemas
    │   └── {feature}.form.schema.ts
    ├── index.ts                       # Public schema API
    └── {feature}.schema.ts            # Core domain schema
```

---

## Implementation Guidelines by Layer

### 📦 Schema Layer (`schema/`)

**Purpose**: Define all data structures with branded types.

**Rules**:
1. All IDs must be branded UUIDs
2. All strings with business meaning must be branded
3. Use Schema composition for reusability
4. Export both schema and type

**Example - Core Schema** (`schema/{feature}.schema.ts`):
```typescript
import { Schema } from "@effect/schema"

// 1. Define branded ID
export const NewsId = Schema.UUID.pipe(Schema.brand("NewsId"))
export type NewsId = typeof NewsId.Type

// 2. Define branded value objects
export const NewsTitle = Schema.String.pipe(
  Schema.minLength(1),
  Schema.maxLength(200),
  Schema.brand("NewsTitle")
)
export type NewsTitle = typeof NewsTitle.Type

export const NewsContent = Schema.String.pipe(
  Schema.minLength(10),
  Schema.brand("NewsContent")
)
export type NewsContent = typeof NewsContent.Type

// 3. Define core entity
export class News extends Schema.Class<News>("News")({
  id: NewsId,
  title: NewsTitle,
  content: NewsContent,
  publishedAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}

export type News = typeof News.Type
```

**Example - API Schema** (`schema/api/{feature}.create.schema.ts`):
```typescript
import { Schema } from "@effect/schema"
import { NewsTitle, NewsContent } from "../news.schema"

export class NewsCreateRequest extends Schema.Class<NewsCreateRequest>("NewsCreateRequest")({
  title: NewsTitle,
  content: NewsContent,
  categoryId: Schema.UUID,
  tags: Schema.Array(Schema.String),
}) {}

export class NewsCreateResponse extends Schema.Class<NewsCreateResponse>("NewsCreateResponse")({
  id: NewsId,
  createdAt: Schema.Date,
}) {}
```

**Example - Form Schema** (`schema/form/{feature}.form.schema.ts`):
```typescript
import { Schema } from "@effect/schema"

export class NewsFormData extends Schema.Class<NewsFormData>("NewsFormData")({
  title: Schema.String,  // Raw form data - not branded yet
  content: Schema.String,
  categoryId: Schema.String,
  tags: Schema.Array(Schema.String),
}) {}

export type NewsFormData = typeof NewsFormData.Type
```

---

### 🏗️ Infrastructure Layer (`infrastructure/`)

**Purpose**: External concerns (HTTP, database, etc.)

**HTTP Services** (`infrastructure/http/services/{feature}.*.service.ts`):

```typescript
import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, Layer, Config, Redacted, Schedule, Schema } from "effect"
import { NewsCreateRequest, NewsCreateResponse } from "../../../schema"
import { NewsId } from "../../../schema/news.schema"

export class NewsCreateService extends Effect.Service<NewsCreateService>()("NewsCreateService", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const baseUrl = yield* Config.redacted("API_BASE_URL")

    const create = (request: NewsCreateRequest) =>
      httpClient.post(`${Redacted.value(baseUrl)}/api/news`, {
        body: HttpClient.body.json(request),
      }).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(NewsCreateResponse)(data)),
        Effect.timeout("5 seconds"),
        Effect.retry({ schedule: Schedule.exponential(1000), times: 3 }),
        Effect.withSpan("NewsCreateService.create", { 
          attributes: { newsTitle: request.title } 
        })
      )

    return { create } as const
  }),
}) {
  // ⭐ MANDATORY: InMemory implementation for testing
  static InMemory = Layer.succeed(NewsCreateService, {
    create: (request: NewsCreateRequest) => {
      const mockResponse: NewsCreateResponse = {
        id: NewsId.make("550e8400-e29b-41d4-a716-446655440000"),
        createdAt: new Date(),
      }
      return Effect.succeed(mockResponse)
    },
    _tag: "NewsCreateService"
  })
}
```

### 🧪 InMemory Implementation - MANDATORY FOR ALL SERVICES

**Every Effect.Service MUST provide an InMemory layer for testing and development.**

**Rules:**
1. ✅ Always create a `static InMemory` property
2. ✅ Use realistic mock data with proper branded types
3. ✅ Return `Effect.succeed(mockData)` for success cases
4. ✅ Can return `Effect.fail(mockError)` for testing error scenarios
5. ✅ Must include the `_tag` property matching the service name

**Complete Example with Multiple Operations:**

```typescript
import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, Layer, Config, Redacted, Schedule, Schema } from "effect"
import {
  News,
  NewsId,
  NewsTitle,
  NewsContent,
  NewsCreateRequest,
  NewsCreateResponse,
  NewsListResponse,
  NewsUpdateRequest
} from "../../../schema"
import { NewsNotFoundError } from "../../../domain/news.errors"

export class NewsService extends Effect.Service<NewsService>()("NewsService", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const baseUrl = yield* Config.redacted("API_BASE_URL")

    const create = (request: NewsCreateRequest) =>
      httpClient.post(`${Redacted.value(baseUrl)}/api/news`, {
        body: HttpClient.body.json(request),
      }).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(NewsCreateResponse)(data)),
        Effect.timeout("5 seconds"),
        Effect.retry({ schedule: Schedule.exponential(1000), times: 3 }),
        Effect.withSpan("NewsService.create")
      )

    const list = (filters?: NewsListFilters) =>
      httpClient.get(`${Redacted.value(baseUrl)}/api/news`, {
        urlParams: filters,
      }).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(NewsListResponse)(data)),
        Effect.timeout("10 seconds"),
        Effect.withSpan("NewsService.list")
      )

    const getById = (id: NewsId) =>
      httpClient.get(`${Redacted.value(baseUrl)}/api/news/${id}`).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(News)(data)),
        Effect.timeout("5 seconds"),
        Effect.withSpan("NewsService.getById", { attributes: { newsId: id } })
      )

    const update = (id: NewsId, request: NewsUpdateRequest) =>
      httpClient.put(`${Redacted.value(baseUrl)}/api/news/${id}`, {
        body: HttpClient.body.json(request),
      }).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(News)(data)),
        Effect.timeout("5 seconds"),
        Effect.withSpan("NewsService.update")
      )

    const deleteById = (id: NewsId) =>
      httpClient.delete(`${Redacted.value(baseUrl)}/api/news/${id}`).pipe(
        Effect.asVoid,
        Effect.timeout("5 seconds"),
        Effect.withSpan("NewsService.delete")
      )

    return { create, list, getById, update, deleteById } as const
  }),
}) {
  // ⭐ InMemory implementation with realistic mock data
  static InMemory = Layer.succeed(NewsService, {
    create: (request: NewsCreateRequest) => {
      const mockResponse: NewsCreateResponse = {
        id: NewsId.make("550e8400-e29b-41d4-a716-446655440000"),
        createdAt: new Date(),
      }
      return Effect.succeed(mockResponse)
    },

    list: (filters?: NewsListFilters) => {
      const mockNews: News[] = [
        {
          id: NewsId.make("550e8400-e29b-41d4-a716-446655440001"),
          title: NewsTitle.make("Mock News 1"),
          content: NewsContent.make("This is the content of mock news 1."),
          publishedAt: new Date("2024-01-15"),
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-12"),
        },
        {
          id: NewsId.make("550e8400-e29b-41d4-a716-446655440002"),
          title: NewsTitle.make("Mock News 2"),
          content: NewsContent.make("This is the content of mock news 2."),
          publishedAt: new Date("2024-01-20"),
          createdAt: new Date("2024-01-18"),
          updatedAt: new Date("2024-01-19"),
        },
      ]

      const mockResponse: NewsListResponse = {
        items: mockNews,
        totalCount: 2,
        page: 1,
        pageSize: 10,
      }

      return Effect.succeed(mockResponse)
    },

    getById: (id: NewsId) => {
      // Simulate success for specific ID
      if (id === "550e8400-e29b-41d4-a716-446655440001") {
        const mockNews: News = {
          id: NewsId.make(id),
          title: NewsTitle.make("Mock News Detail"),
          content: NewsContent.make("Detailed content of the mock news."),
          publishedAt: new Date("2024-01-15"),
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-12"),
        }
        return Effect.succeed(mockNews)
      }

      // Simulate error for unknown IDs
      return Effect.fail(new NewsNotFoundError({ id }))
    },

    update: (id: NewsId, request: NewsUpdateRequest) => {
      const mockUpdatedNews: News = {
        id: NewsId.make(id),
        title: request.title,
        content: request.content,
        publishedAt: new Date(),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date(), // Now
      }
      return Effect.succeed(mockUpdatedNews)
    },

    deleteById: (id: NewsId) => {
      // Simulate successful deletion
      return Effect.void
    },

    _tag: "NewsService"
  })
}
```

### 🎯 Using InMemory Layers in Tests

```typescript
import { Effect, Layer } from "effect"
import { describe, it, expect } from "vitest"
import { NewsService } from "./news.service"
import { NewsCreateRequest } from "../../../schema"

describe("NewsService", () => {
  it("should create news with InMemory layer", async () => {
    const program = Effect.gen(function* () {
      const service = yield* NewsService
      
      const request = new NewsCreateRequest({
        title: NewsTitle.make("Test News"),
        content: NewsContent.make("Test content for news"),
        categoryId: "123",
        tags: ["test"],
      })

      return yield* service.create(request)
    })

    // Use InMemory layer instead of real HTTP
    const result = await Effect.runPromise(
      program.pipe(Effect.provide(NewsService.InMemory))
    )

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
  })
})
```

### 🏗️ Complex Example: IMDb Client Service

```typescript
import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, Layer, Config, Redacted, Schedule, Schema } from "effect"
import {
  ImdbId,
  ImdbType,
  PrimaryTitle,
  OriginalTitle,
  PrimaryImageUrl,
  PrimaryImageWidth,
  PrimaryImageHeight,
  StartYear,
  RuntimeSeconds,
  Genre,
  Genres,
  AggregateRating,
  VoteCount,
  Plot
} from "../../../schema/imdb.schema"
import { EndPointResponseApi, IMdbData } from "../../../schema/api/imdb.api.schema"

export class ImdbClientHttp extends Effect.Service<ImdbClientHttp>()("ImdbClientHttp", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const baseUrl = yield* Config.redacted("IMDB_API_BASE_URL")

    const callImdbApi = () =>
      httpClient.get(`${Redacted.value(baseUrl)}/titles`).pipe(
        Effect.andThen((response) => response.json),
        Effect.flatMap((data) => Schema.decodeUnknown(EndPointResponseApi)(data)),
        Effect.timeout("5 seconds"),
        Effect.retry({ schedule: Schedule.exponential(1000), times: 3 }),
        Effect.withSpan("ImdbClientHttp.callImdbApi", {
          attributes: { url: `${baseUrl}/titles?types=MOVIE` }
        })
      )

    return { callImdbApi } as const
  })
}) {
  static InMemory = Layer.succeed(ImdbClientHttp, {
    callImdbApi: () => {
      // Create realistic mock movie data with all branded types
      const mockMovie: IMdbData = {
        id: ImdbId.make("tt0000001"),
        type: ImdbType.make("movie"),
        primaryTitle: PrimaryTitle.make("Mock Movie"),
        originalTitle: OriginalTitle.make("Mock Movie Original"),
        primaryImage: {
          url: PrimaryImageUrl.make(new URL("https://example.com/mock.jpg")),
          width: PrimaryImageWidth.make(800),
          height: PrimaryImageHeight.make(600)
        },
        startYear: StartYear.make(2024),
        runtimeSeconds: RuntimeSeconds.make(5400), // 90 minutes
        genres: Genres.make([Genre.make("Drama"), Genre.make("Action")]),
        rating: {
          aggregateRating: AggregateRating.make(7.8),
          voteCount: VoteCount.make(2000)
        },
        plot: Plot.make("This is a mock plot for testing.")
      }

      const mockResponse: EndPointResponseApi = {
        titles: [mockMovie],
        totalCount: 1,
        nextPageToken: "next-mock"
      }

      return Effect.succeed(mockResponse)
    },
    _tag: "ImdbClientHttp"
  })
}
```

**Query Keys** (`infrastructure/query-keys/{feature}.query-keys.ts`):
```typescript
import { NewsId } from "../../schema"

export const newsQueryKeys = {
  all: ["news"] as const,
  lists: () => [...newsQueryKeys.all, "list"] as const,
  list: (filters: NewsListFilters) => [...newsQueryKeys.lists(), filters] as const,
  details: () => [...newsQueryKeys.all, "detail"] as const,
  detail: (id: NewsId) => [...newsQueryKeys.details(), id] as const,
}
```

**Layer Composition** (`infrastructure/{feature}.layer.ts`):
```typescript
import { Layer } from "effect"
import { NewsCreateService } from "./http/services/news.create.service"
import { NewsListService } from "./http/services/news.list.service"
// ... other services

export const NewsServiceLayer = Layer.mergeAll(
  NewsCreateService.Default,
  NewsListService.Default,
  NewsUpdateService.Default,
  NewsDeleteService.Default,
  NewsDetailsService.Default
)
```

---

### 🎯 Domain Layer (`domain/`)

**Domain Errors** (`domain/{feature}.errors.ts`):
```typescript
import { Data } from "effect"

export class NewsTitleTooShortError extends Data.TaggedError("NewsTitleTooShortError")<{
  readonly minLength: number
  readonly actualLength: number
}> {}

export class NewsNotFoundError extends Data.TaggedError("NewsNotFoundError")<{
  readonly id: NewsId
}> {}

export class NewsAlreadyPublishedError extends Data.TaggedError("NewsAlreadyPublishedError")<{
  readonly id: NewsId
  readonly publishedAt: Date
}> {}

export type NewsDomainError =
  | NewsTitleTooShortError
  | NewsNotFoundError
  | NewsAlreadyPublishedError
```

**Error Mapper** (`domain/{feature}.error-mapper.ts`):
```typescript
import { Match } from "effect"
import { NewsDomainError } from "./news.errors"

export const mapNewsErrorToMessage = (error: NewsDomainError): string =>
  Match.value(error).pipe(
    Match.tag("NewsTitleTooShortError", ({ minLength, actualLength }) =>
      `Title must be at least ${minLength} characters (got ${actualLength})`
    ),
    Match.tag("NewsNotFoundError", ({ id }) =>
      `News with ID ${id} not found`
    ),
    Match.tag("NewsAlreadyPublishedError", ({ publishedAt }) =>
      `News already published on ${publishedAt.toLocaleDateString()}`
    ),
    Match.exhaustive
  )
```

**Domain Events** (`domain/{feature}.event.ts`):
```typescript
import { Data } from "effect"
import { NewsId } from "../schema"

export class NewsCreatedEvent extends Data.TaggedClass("NewsCreatedEvent")<{
  readonly newsId: NewsId
  readonly timestamp: Date
}> {}

export class NewsPublishedEvent extends Data.TaggedClass("NewsPublishedEvent")<{
  readonly newsId: NewsId
  readonly timestamp: Date
}> {}

export type NewsEvent = NewsCreatedEvent | NewsPublishedEvent
```

---

### 🏢 Application Layer (`application/`)

**Facade** (`application/{feature}.facade.ts`):
```typescript
import { Effect } from "effect"
import { NewsCreateService } from "../infrastructure/http/services/news.create.service"
import { NewsFormData } from "../schema"
import { newsFormToApiCodec } from "../factory/codecs/news.create.form-to-api.codec"

export class NewsFacade extends Effect.Service<NewsFacade>()("NewsFacade", {
  effect: Effect.gen(function* () {
    const createService = yield* NewsCreateService

    const createNews = (formData: NewsFormData) =>
      Effect.gen(function* () {
        // 1. Transform form data to API request
        const apiRequest = newsFormToApiCodec(formData)
        
        // 2. Call service
        const response = yield* createService.create(apiRequest)
        
        // 3. Emit domain event (if needed)
        // yield* EventBus.publish(new NewsCreatedEvent({ ... }))
        
        return response
      })

    return { createNews } as const
  }),
}) {}
```

---

### 🏭 Factory Layer (`factory/`)

**Codec** (`factory/codecs/{feature}.create.form-to-api.codec.ts`):
```typescript
import { NewsFormData } from "../../schema/form/news.form.schema"
import { NewsCreateRequest } from "../../schema/api/news.create.schema"
import { NewsTitle, NewsContent } from "../../schema/news.schema"
import { Schema } from "@effect/schema"

export const newsFormToApiCodec = (form: NewsFormData): NewsCreateRequest => {
  // Transform and validate form data to branded types
  const title = Schema.decodeSync(NewsTitle)(form.title)
  const content = Schema.decodeSync(NewsContent)(form.content)
  
  return new NewsCreateRequest({
    title,
    content,
    categoryId: form.categoryId,
    tags: form.tags,
  })
}
```

**Mapper** (`factory/mappers/{feature}-to-form.mapper.ts`):
```typescript
import { News } from "../../schema/news.schema"
import { NewsFormData } from "../../schema/form/news.form.schema"

export const newsToFormMapper = (news: News): NewsFormData => ({
  title: news.title,  // Unbranded for form
  content: news.content,
  categoryId: news.categoryId,
  tags: news.tags,
})
```

---

### 🪝 Hooks Layer (`hooks/`)

**Query Hook** (`hooks/queries/use-{feature}-detail-query.ts`):
```typescript
import { useQuery } from "@tanstack/react-query"
import { Effect, Runtime } from "effect"
import { NewsId } from "../../schema"
import { NewsDetailsService } from "../../infrastructure/http/services/news.details.service"
import { newsQueryKeys } from "../../infrastructure/query-keys/news.query-keys"
import { useNewsRuntime } from "../../context/news-runtime-context"

export const useNewsDetailQuery = (id: NewsId) => {
  const runtime = useNewsRuntime()

  return useQuery({
    queryKey: newsQueryKeys.detail(id),
    queryFn: () =>
      Effect.gen(function* () {
        const service = yield* NewsDetailsService
        return yield* service.getById(id)
      }).pipe(Runtime.runPromise(runtime)),
  })
}
```

**Mutation Hook** (`hooks/mutations/use-create-{feature}.mutation.ts`):
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Effect, Runtime } from "effect"
import { NewsFormData } from "../../schema"
import { NewsFacade } from "../../application/news.facade"
import { newsQueryKeys } from "../../infrastructure/query-keys/news.query-keys"
import { useNewsRuntime } from "../../context/news-runtime-context"

export const useCreateNewsMutation = () => {
  const runtime = useNewsRuntime()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: NewsFormData) =>
      Effect.gen(function* () {
        const facade = yield* NewsFacade
        return yield* facade.createNews(formData)
      }).pipe(Runtime.runPromise(runtime)),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsQueryKeys.lists() })
    },
  })
}
```

**Form Hook** (`hooks/forms/use-{feature}-form.tsx`):
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewsFormData } from "../../schema"
import { newsFormSchema } from "../../schema/form/news.form.schema"

export const useNewsForm = (defaultValues?: Partial<NewsFormData>) => {
  return useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      tags: [],
      ...defaultValues,
    },
  })
}
```

---

### ⚛️ Components Layer (`components/`)

**Container** (`components/containers/{feature}-create-container.tsx`):
```typescript
import { useCreateNewsMutation } from "../../hooks/mutations/use-create-news.mutation"
import { useNewsForm } from "../../hooks/forms/use-news-form"
import { NewsForm } from "../form/news-form"

export const NewsCreateContainer = () => {
  const form = useNewsForm()
  const createMutation = useCreateNewsMutation()

  const handleSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        // Show success message
      },
    })
  })

  return (
    <NewsForm
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  )
}
```

**Context** (`context/{feature}-runtime-context.tsx`):
```typescript
import { createContext, useContext } from "react"
import { Runtime } from "effect"
import { NewsServiceLayer } from "../infrastructure/news.layer"

const NewsRuntimeContext = createContext<Runtime.Runtime<NewsServiceLayer> | null>(null)

export const NewsRuntimeProvider = ({ children }: { children: React.ReactNode }) => {
  const runtime = React.useMemo(
    () => Runtime.runSync(Layer.toRuntime(NewsServiceLayer)),
    []
  )

  return (
    <NewsRuntimeContext.Provider value={runtime}>
      {children}
    </NewsRuntimeContext.Provider>
  )
}

export const useNewsRuntime = () => {
  const runtime = useContext(NewsRuntimeContext)
  if (!runtime) throw new Error("NewsRuntimeProvider not found")
  return runtime
}
```

---

## Implementation Workflow

### When Feature EXISTS:
1. Identify the layer(s) impacted by the change
2. Update only necessary files
3. Maintain consistency with existing patterns
4. Add tests for new behavior

### When Feature DOES NOT EXIST:
1. **Create complete folder structure** as shown above
2. **Start with Schema layer** (bottom-up):
   - Core schema (`schema/{feature}.schema.ts`)
   - API schemas (`schema/api/*.ts`)
   - Form schemas (`schema/form/*.ts`)
3. **Build Infrastructure layer**:
   - HTTP services (`infrastructure/http/services/*.ts`)
   - Query keys
   - Layer composition
4. **Implement Domain layer**:
   - Errors
   - Error mappers
   - Events (if needed)
5. **Create Application layer**:
   - Facade
6. **Develop Factory layer**:
   - Codecs
   - Mappers
7. **Build Hooks layer**:
   - Queries
   - Mutations
   - Forms
8. **Implement Components layer**:
   - Containers first
   - Then presentational components

---

## Testing Requirements

### Unit Tests Required For:
- ✅ Codecs (form-to-api transformations)
- ✅ Mappers (data transformations)
- ✅ Error mappers
- ✅ Domain logic in facades
- ✅ **Services using InMemory layers** ⭐

### Integration Tests Required For:
- ✅ HTTP services (mocked)
- ✅ Query hooks
- ✅ Mutation hooks

### Important: Always Use InMemory Layers for Testing
**NEVER mock Effect services manually. Always use the static InMemory layer provided by the service.**

```typescript
// ❌ WRONG - Manual mocking
vi.mock("./news.service", () => ({
  NewsService: { create: vi.fn() }
}))

// ✅ CORRECT - Use InMemory layer
const program = Effect.gen(function* () {
  const service = yield* NewsService
  return yield* service.create(request)
})

await Effect.runPromise(
  program.pipe(Effect.provide(NewsService.InMemory))
)
```

### Example Test:
```typescript
import { describe, it, expect } from "vitest"
import { newsFormToApiCodec } from "./news.create.form-to-api.codec"

describe("newsFormToApiCodec", () => {
  it("should transform valid form data to API request", () => {
    const formData = {
      title: "Test News",
      content: "This is test content that is long enough",
      categoryId: "123",
      tags: ["tech", "ai"],
    }

    const result = newsFormToApiCodec(formData)

    expect(result.title).toBe("Test News")
    expect(result.tags).toHaveLength(2)
  })

  it("should throw on invalid title length", () => {
    const formData = {
      title: "", // Too short
      content: "Valid content here",
      categoryId: "123",
      tags: [],
    }

    expect(() => newsFormToApiCodec(formData)).toThrow()
  })
})
```

---

## Naming Conventions

### Files:
- Schemas: `{feature}.{purpose}.schema.ts`
- Services: `{feature}.{action}.service.ts`
- Hooks: `use-{feature}-{purpose}.ts`
- Components: `{feature}-{purpose}-container.tsx`

### Variables & Functions:
- **Branded types**: `PascalCase` (e.g., `NewsId`, `NewsTitle`)
- **Services**: `camelCase` with action suffix (e.g., `createNews`, `getNewsById`)
- **Hooks**: `use{Feature}{Purpose}` (e.g., `useNewsDetailQuery`)
- **Components**: `PascalCase` (e.g., `NewsCreateContainer`)

---

## Mandatory Output Format

After implementing a feature, provide:

```markdown
## 📋 Implementation Summary
[Brief description of what was implemented]

## 🏗️ Architecture Decisions
- **Branded Types Created**: List all new branded types
- **Layer Modifications**: Which layers were touched
- **Effect Services**: New services created
- **Rationale**: Why this approach was chosen

## 📁 Files Created/Modified

### Created:
- `src/features/{domain}/{feature}/schema/{feature}.schema.ts`
- `src/features/{domain}/{feature}/infrastructure/http/services/{feature}.create.service.ts`
- [... other files]

### Modified:
- `src/features/{domain}/{feature}/hooks/index.ts` - Added new hook export
- [... other files]

## ✅ Type Safety Verification
- [x] All types are branded
- [x] No `any` or `undefined` used
- [x] All schemas properly exported
- [x] Effect services properly typed
- [x] **All services have InMemory implementation** ⭐

## 🧪 Tests
- [x] Unit tests for codecs: `{feature}.create.form-to-api.codec.test.ts`
- [x] Unit tests for error mapper: `{feature}.error-mapper.test.ts`
- [ ] N/A - Simple UI component

## ⚠️ Known Limitations
[Any technical debt or follow-up work]

## 💡 Follow-up Suggestions
[Optional improvements for future iterations]
```

---

## Anti-Patterns - NEVER DO THIS

❌ **Using raw types:**
```typescript
type UserId = string  // NO!
```

✅ **Always use branded types:**
```typescript
const UserId = Schema.UUID.pipe(Schema.brand("UserId"))
type UserId = typeof UserId.Type
```

---

❌ **Using any or undefined:**
```typescript
function process(data: any): undefined { }  // NO!
```

✅ **Use proper Effect types:**
```typescript
function process(data: unknown): Effect.Effect<Result, ProcessError> { }
```

---

❌ **Creating folders/files outside the structure:**
```typescript
// NO! Don't create random folders
src/utils/news-helper.ts
```

✅ **Follow the strict structure:**
```typescript
src/features/admin/news/factory/mappers/news-helper.mapper.ts
```

---

❌ **Skipping layers:**
```typescript
// NO! Don't call services directly from components
const NewsComponent = () => {
  const data = await fetch("/api/news")  // NO!
}
```

✅ **Use proper layer separation:**
```typescript
// Component → Hook → Facade → Service
const NewsComponent = () => {
  const { data } = useNewsListQuery()  // YES!
}
```

---

❌ **Creating services without InMemory implementation:**
```typescript
export class NewsService extends Effect.Service<NewsService>()("NewsService", {
  effect: Effect.gen(function* () {
    // ... implementation
  })
}) {}  // NO! Missing InMemory
```

✅ **Always provide InMemory layer:**
```typescript
export class NewsService extends Effect.Service<NewsService>()("NewsService", {
  effect: Effect.gen(function* () {
    // ... implementation
  })
}) {
  static InMemory = Layer.succeed(NewsService, {
    create: (req) => Effect.succeed(mockResponse),
    _tag: "NewsService"
  })
}
```

---

### Creating a new feature checklist:
- [ ] Create folder structure
- [ ] Define branded types in schema layer
- [ ] Implement HTTP services
- [ ] **Create InMemory implementation for each service** ⭐
- [ ] Create query keys
- [ ] Compose Effect layer
- [ ] Define domain errors and mappers
- [ ] Build application facade
- [ ] Create codecs and mappers
- [ ] Implement React Query hooks
- [ ] Build containers and components
- [ ] Write tests using InMemory layers
- [ ] Verify no `any` or `undefined`

### When stuck:
1. Check if feature exists → Update existing files
2. Feature doesn't exist → Create full structure
3. Unsure about type → Make it branded
4. Need optional value → Use `Option.Option<T>`
5. External data → Start with `unknown`

---

## Success Criteria

✅ Implementation is successful when:
- All types are branded from Schema
- Zero usage of `any` or `undefined`
- Complete folder structure follows template
- Effect services properly composed in layers
- React Query hooks use runtime context
- Tests cover all transformations
- Code can be statically analyzed without errors
- Domain errors are properly mapped to user messages
