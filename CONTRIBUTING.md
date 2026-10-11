# Contributing

Use English for commit messages and pull request titles. Keep each change focused on one assignment/lab or one repository concern.

## Repository layout

- `ass1/LamThoaiThanh_SE1910/`: Assignment 01 application, tests and evidence.
- Add future coursework under separate directories such as `lab01/`, `lab02/`.
- Do not upload lecture PDFs, unrelated files, `node_modules`, build output, `.env` files, tokens or real passwords.

## GitHub Flow

1. Start from the latest `main`.
2. Create a lowercase branch such as `feature/ass1-news-search`, `fix/ass1-dialog-reset` or `docs/lab01-readme`.
3. Make focused commits with `type(scope): imperative description`.
4. Push the branch and open a pull request into `main`.
5. Self-review the diff and wait for the required `verify` check and at least one approving review.
6. Squash merge after approval. GitHub deletes merged branches automatically.

The initial repository bootstrap is the only authorized direct push to `main`. Branch protection applies to administrators, requires a review and an up-to-date successful `verify` check, and rejects force pushes.

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

Follow SemVer: MAJOR for breaking changes, MINOR for compatible features, PATCH for compatible fixes. Assignment 01 starts at `1.0.0`. Create release tag `v1.0.0` only after the approved PR is merged; do not tag unmerged work as a stable release.

For later projects, update the verification workflow to include their checks while preserving the required `verify` job name.
