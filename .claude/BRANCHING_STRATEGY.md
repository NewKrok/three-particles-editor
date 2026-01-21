# Branching Strategy

## Overview

This repository follows a simplified Git Flow branching model with two main branches:

- **`master`** - Production-ready code
- **`dev`** - Active development branch

## Branch Descriptions

### master

- The main production branch
- Contains stable, release-ready code
- Protected branch with CI/CD automation
- All releases are tagged from this branch
- Direct commits are not allowed (except for hotfixes)

### dev

- The primary development branch
- All feature development happens here or in feature branches that merge back to `dev`
- May contain experimental or in-progress features
- Regularly merged to `master` when stable

## Workflow

### Feature Development

1. Create a new branch from `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push and create a Pull Request to `dev`:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Bug Fixes

1. For non-critical bugs, branch from `dev`:

   ```bash
   git checkout dev
   git checkout -b fix/bug-description
   ```

2. For critical production bugs (hotfixes), branch from `master`:
   ```bash
   git checkout master
   git checkout -b hotfix/critical-bug-description
   ```

### Releases

1. When `dev` is stable and ready for release, create a Pull Request from `dev` to `master`

2. After merge, the CI/CD pipeline will:
   - Run tests and build
   - Create a new release version (using semantic-release)
   - Generate CHANGELOG
   - Deploy to production

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```bash
feat: add new particle emission shape
fix: resolve memory leak in particle disposal
docs: update installation instructions
```

## Branch Naming

- Feature branches: `feature/description` or `feat/description`
- Bug fix branches: `fix/description` or `bugfix/description`
- Hotfix branches: `hotfix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

## Protection Rules

### master branch

- Requires pull request reviews
- Requires status checks to pass
- No force pushes allowed
- No deletions allowed

### dev branch

- Recommended to use pull requests
- Status checks should pass
- Direct commits allowed for maintainers

## Version Management

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated version management:

- **Major version** (X.0.0) - Breaking changes
- **Minor version** (0.X.0) - New features (backward compatible)
- **Patch version** (0.0.X) - Bug fixes (backward compatible)

Versions are automatically determined from commit messages.

## Best Practices

1. **Keep branches up to date**: Regularly pull changes from `dev`

   ```bash
   git checkout dev
   git pull origin dev
   git checkout your-branch
   git merge dev
   ```

2. **Small, focused commits**: Make commits that address a single concern

3. **Write clear commit messages**: Follow the conventional commit format

4. **Test before merging**: Ensure all tests pass locally before creating a PR

5. **Delete merged branches**: Clean up feature branches after they're merged

6. **Review PRs promptly**: Keep the development flow smooth

## Emergency Procedures

### Hotfix for Production

1. Branch from `master`:

   ```bash
   git checkout master
   git checkout -b hotfix/critical-issue
   ```

2. Fix the issue and commit

3. Create PRs to both `master` AND `dev`:

   ```bash
   git push -u origin hotfix/critical-issue
   # Create PR to master
   # Create PR to dev
   ```

4. Merge to `master` first, then to `dev`

## Questions?

For questions about the branching strategy, please open an issue or contact the maintainers.
