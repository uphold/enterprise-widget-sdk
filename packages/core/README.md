# enterprise-widget-sdk-core

[![npm version](https://img.shields.io/npm/v/@uphold/enterprise-widget-sdk-core.svg?style=flat-square)](https://www.npmjs.com/package/@uphold/enterprise-widget-sdk-core)

Core SDK package to support enterprise widgets.

## Installation

To install the package, run:

```bash
npm install @uphold/enterprise-widget-sdk-core
```

## Usage

This package should not be used directly. Please refer to the specific widget SDK packages for usage instructions.

## Contributing

### Installing the project

Install the dependencies:

```bash
npm install
```

### Development

#### Lint

To lint the project, run:

```sh
npm run lint
```

#### Test

To test the project, run:

```sh
npm test
```

#### Typecheck

To type check the project, run:

```sh
npm run typecheck
```

### Building for production

To create a production build, run:

```sh
npm run build
```

### Generating a new release

Releases are performed manually via a specific `Release` GitHub workflow. After merging the changes to the `master` branch, trigger the workflow selecting that branch and the appropriate version bump to apply to the new version.

> [!IMPORTANT]
> After releasing a new version, make sure to update the dependencies section in the `package.json` files of the other packages in the monorepo to use the newly released version. This is necessary because internal dependencies are not automatically updated during the release process due to the tool being used not supporting monorepos. This will be updated in the future when we migrate to a different release tool.
