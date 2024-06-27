# Contributing to Create VC Bot

Thank you for your interest in contributing to this project! Please take a moment
to read this document as it outlines the process for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Bug Reports](#bug-reports)
  - [Feature Requests](#feature-requests)
  - [Code Changes](#code-changes)
    - [Development setup](#development-setup)
      - [Prerequisites](#prerequisites)
      - [Setup](#setup)
    - [Branches](#branches)
    - [Testing & Linting](#testing--linting)
    - [Commit Messages](#commit-messages)
    - [Pull Requests](#pull-requests)
    - [Code Review](#code-review)

## Code of Conduct

This project and everyone participating in it is governed by the
[Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold this code. Please report unacceptable behavior to
<090302@5409.dk>.

## How to Contribute

There are several ways to contribute to this project: you can:
- [report bugs](#bug-reports);
- [request features](#feature-requests); and
- make [code changes](#code-changes).

### Bug Reports

Before submitting a bug report, please check the [issue tracker] to see if the
bug has already been reported. If it has not, please open a [new issue] and fill
out the template.

### Feature Requests

Before submitting a feature request, please check the [issue tracker] to see if
the feature has already been requested. If it has not, please open a [new issue]
and fill out the template.

### Code Changes

If you would like to make a code change, please follow the below steps:

1. Check the [issue tracker] to see if the change has already been requested.
   If it has not, please open a [new issue] and fill out the template. If the
   change has already been requested, please comment on the issue to let me know
   you are working on it.
2. Set up your development environment (see
   [Development Setup](#development-setup)).
3. Create a new branch off of the `develop` or `hotfix` branch (see
   [Branches](#branches)).
4. Make your changes and add tests if relevant
   (see [Testing & Linting](#testing--linting)).
5. Commit your changes (see [Commit Messages](#commit-messages)).
6. Push your changes to the branch you created in step 3.
7. Open a pull request (see [Pull Requests](#pull-requests)).
8. Wait for a reviewer to review your code (see [Code Review](#code-review)).

#### Development Setup

##### Prerequisites

You will need:
- [Git](https://git-scm.com/) to clone the repository;
- [NPM](https://www.npmjs.com/) to install dependencies; and
- [MongoDB](https://www.mongodb.com/) to store data.

##### Setup

After installing the prerequisites, follow the below steps to set up your
development environment:

1. Clone the repository:
   ```bash
   git clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the setup script:
   ```bash
   bash -f ./setup.sh
   ```
4. Edit the `.env` file to add your Discord bot token.

#### Branches

The `master` branch contains the latest stable release. The `develop` branch
contains the latest development version. Unless it is an urgent bugfix (in which
case you should base a new branch off of the `hotfix` branch), you should make
your changes in a new branch off of the `develop` branch:

```bash
git checkout develop
git checkout -b <your username>/<GitHub issue number>_<short-description>
```

The ´<short-description>´ of the change you are making should be written in
kebab-case and only contain lowercase letters, numbers, and hyphens. For
example, if you are fixing a bug with the bot crashing when a user sends a
message, you could name your branch `gimjb/123_fix-crash-on-message-send` (where
`gimjb` is your GitHub username, `123` is the GitHub issue number, and
`crash-on-message-send` is a short description of the issue).

#### Testing & Linting

You can run the tests with `npm run test` and lint the code with
`yarn lint`. If relevant, please add tests for your changes. When all tests and
linters pass, you can commit your changes.

#### Commit Messages

Follow the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
for your commit messages. You can use the following prefixes:

- `build`: changes that affect the build system;
- `chore`: changes that do not modify `src` or `test` files;
- `ci`: continuous intregration (CI), such as GitHub Actions, merges, etc.;
- `docs`: documentation only changes;
- `feat`: a new, changed, or removed feature;
- `fix`: a bug fix;
- `refactor`: a code change that neither fixes a bug nor adds a feature;
- `revert`: reverts to a previous commit.
- `style`: style changes that do not affect the meaning of the code;
- `test`: adding missing tests or correcting existing tests; and
  configuration files, version bumps, etc.).

Limit lines to 120 characters. If you need to explain the commit in more detail,
add a body to the commit message. The body should be separated from the subject
by a blank line and each line should be limited to 120 characters.

#### Pull Requests

Once you have made your changes, push them to a new branch and open a
[pull request](../../pulls) to merge your changes into the `developement`
branch (or `hotfix` branch if it is an urgent bugfix). Please fill out the
PR template and follow its checklist, then assign a reviewer.

#### Code Review

Once you have opened a pull request, a reviewer will review your code. If
changes are requested by the reviewer, please make the requested changes and
push them to the same branch. The reviewer will review your changes again. Once
the reviewer approves your changes, he will merge your changes into the
`development` branch (or the `hotfix` branch if it is an urgent bugfix).

[issue tracker]: ../issues
[new issue]: ../issues/new
