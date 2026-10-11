# Contributing

Use English for commit messages and pull request titles. Keep each change focused on one assignment/lab or one repository concern.

## Repository layout

- `ass1/LamThoaiThanh_SE1910/`: Assignment 01 application, tests and evidence.
- Add future coursework under separate directories such as `lab01/`, `lab02/`.
- Do not upload lecture PDFs, unrelated files, `node_modules`, build output, `.env` files, tokens or real passwords.

## Personal repository workflow

1. Start from the latest `main`.
2. Optionally create a lowercase working branch such as `feature/ass1-news-search`, `fix/ass1-dialog-reset` or `docs/lab01-readme`.
3. Make focused commits with `type(scope): imperative description`.
4. Self-review the diff, run the checks below, then fast-forward `main` to the verified work.
5. Push `main` normally. The owner explicitly requested direct publishing without PR/review for this personal repository.
6. GitHub Actions runs `verify` on each push to `main`. Fix any failing check before continuing development.

Branch protection rejects force pushes and branch deletion. Required PR reviews and blocking status checks are disabled to allow the owner's requested direct-push workflow. PR templates remain available if collaboration is introduced later; reviews are optional in the current workflow.

## Commit examples

```text
feat(ass1): add article search
fix(auth): restore protected deep link after login
test(ass1): cover duplicate usernames
docs(ass1): explain state ownership
```

Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` or `revert`. Keep the subject below 72 characters, use the imperative, and omit the final period. Reference actual issues in the footer, for example `Closes #12`. Use `!` or `BREAKING CHANGE:` for incompatible changes.

## Assignment 01 validation

```sh
cd ass1/LamThoaiThanh_SE1910
npm ci
npx playwright install chromium
npm run format:check
npm run build
npm test
```

Application and test code must not contain comments. Put explanations in `docs/`.

## Versions

Follow SemVer: MAJOR for breaking changes, MINOR for compatible features, PATCH for compatible fixes. Assignment 01 starts at `1.0.0`. Create release tag `v1.0.0` on the verified commit published to `main`.

For later projects, update the verification workflow to include their checks.
