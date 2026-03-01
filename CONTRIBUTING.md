# Contributing

Thanks for your interest in contributing to the GlossPipe Framer SDK!

## Getting Started

```bash
git clone https://github.com/<org>/framer-sdk.git
cd framer-sdk
npm install
npm run build
npm test
```

## Development

```bash
npm run dev       # watch mode (rebuilds on change)
npm run test:watch  # run tests in watch mode
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
npm run format      # Prettier check
```

## DCO Sign-Off

All contributions require a [Developer Certificate of Origin](https://developercertificate.org/) (DCO) sign-off. This certifies that you wrote or have the right to submit the code under this project's MIT license.

Add a sign-off line to every commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

You can do this automatically with `git commit -s`.

If you forget, you can amend your most recent commit:

```bash
git commit --amend -s
```

## Pull Requests

1. Fork the repository and create a feature branch.
2. Make your changes with tests.
3. Ensure `npm run build`, `npm run typecheck`, and `npm test` all pass.
4. Sign off every commit (see above).
5. Open a pull request with a clear description of what changed and why.

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- Inline styles only in components (no CSS modules/Tailwind) for Framer compatibility
