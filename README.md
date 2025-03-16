<a name="readme-top"></a>

<br />
<div align="center">
  <h1 align="center">enterprise-widget-sdk</h1>

  <p align="center">
    A monorepo for the Enterprise Widget SDKs.
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## About The Project

A set of SDKs for easy integration with Enterprise Widgets.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Please make sure your machine is using the correct versions Node.js and NPM before installing the project, otherwise you may run into installation issues. Check the `package.json` file for the required Node version.

### Project Structure

The project is organized as follows:

- [`packages`](./packages/): Contain shared packages by all projects.
- [`projects/payment-widget`](./projects/payment-widget-js-sdk/): The implementation of the `payment-widget-js-sdk` project.

### Installation

This project uses [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) that allows for managing multiple packages within a single repository. The installation process will look for all workspaces and install its dependencies, and also create the necessary symlinks for internal dependencies.

#### 1. Clone the repo

```sh
git clone https://github.com/uphold/enterprise-widget-sdk.git && cd enterprise-widget-sdk
```

#### 2. Use the required Node version

```sh
nvm use
```

_Note: If you don't use NVM, please make sure you have a compatible Node version installed in your machine._

#### 3. Install dependencies

```sh
npm install
```

#### 4. Check if everything runs without issues

```js
npm run lint
npm run typecheck
npm test
```

#### 5. Running a project

Every project has its own README with specialized instructions on how to run it. Please refer to the project's README for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Any contributions you make are **greatly appreciated**. After the initial setup, you can follow the steps below to contribute to the project:

1. Create a branch with the convention `<prefix>/<branch-name>`:
   - **feature:** (`git checkout -b feature/amazing-feature`)
   - **support:** (`git checkout -b support/config-task`)
   - **enhancement:** (`git checkout -b enhancement/improve-something`)
   - **bugfix:** (`git checkout -b bugfix/annoying-bug`)
2. Commit your changes (`git commit -m 'Summary message of the changes introduced'`)
3. Push to the branch (`git push origin <prefix>/<branch-name>`)
4. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>
