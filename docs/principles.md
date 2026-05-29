# Code Principles

## SOLID

| Letter | Principle | Application |
|---|---|---|
| **S** | Single Responsibility | Each component/function does **one** thing |
| **O** | Open/Closed | Extend via props and slots, don't modify |
| **L** | Liskov Substitution | Subtypes replace base types without breaking |
| **I** | Interface Segregation | Small, specific interfaces |
| **D** | Dependency Inversion | Features depend on abstractions (types), not concrete implementations |

## KISS

> **Keep It Simple, Stupid.**

- Components ~50–100 lines
- Prefer an obvious `if` over an clever pattern
- Astro `.astro` > JSX when no interactivity is needed

## YAGNI

> **You Ain't Gonna Need It.**

- No generic abstractions before the 3rd use case
- No hooks/libs for problems that don't exist yet
- `api/` folders only exist when there's logic to extract

## DRY

> **Don't Repeat Yourself.** With moderation.

- Duplication is temporarily acceptable
- Extract only when the pattern confirms itself (Rule of Three)
- Prefer composition over inheritance

## Clean Code

- Names reveal intent (`getPublishedPosts` > `getData`)
- Functions max ~20 lines
- No comments explaining *what* — code should speak
- Comments only for *why* (decisions, trade-offs)
