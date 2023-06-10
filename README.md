# Ignition Tools

Tools and resources for working with Ignition by Inductive Automation.

*This is an unofficial repo.*

## What's inside?

This repo includes the following packages:

### Packages

-   `create-perspective-theme`: a cli tool for quickly setting up Perspective theming projects
-   `ignition-resource-builder`: Javascript library for building project import files
-   `postcss-perspective-style-class`: a Postcss plugin for generating Perspective Style Classes from CSS
-   `eslint-config-custom`: `eslint` configurations used throughout the monorepo
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This repo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

## Contributing

This library is a [Turborepo] monorepo.
For more information about Turborepo, [visit turbo.build/repo](https://turbo.build/repo).

[Turborepo]: https://github.com/vercel/turbo

### Cloning
```sh
git clone https://github.com/mussonindustrial/ignition-tools
```

### Formatting
Formatting is handled by [Prettier](https://prettier.io).
```sh
npm run format
```

### Linting
Linting is handled by [ESLint](https://eslint.org/).
```sh
npm run lint
```

### Testing
Testing is handled by [Vitest](https://github.com/vitest-dev/vitest)
```sh
npm run test
```

### Building
```sh
npm run build
```