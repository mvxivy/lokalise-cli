# Lokalise CLI

This script is used to download translations from Lokalise to your project and update. 

## Installation

```bash
npm install -D @mvxivy/lokalise-cli
```

## Usage

### CLI 
```bash
ltu
```

### Features
* Fetch and update locales from the `master` branch of your lokalise project 
  * Fetch by files (recommended)
  * Fetch by JSON
* Select another branch, merge it into `master` branch and then fetch and update
  * You can skip this step by pressing Enter
  * You can optionally choose to delete the branch after merging

## Configuration
If you use cli method, you can create a `.lokalise.json` file in the root of your project and add the following configuration options.

### Configuration options

| Option                 | Description                                       | type             | Default |
|------------------------|---------------------------------------------------|------------------|---------|
| apiKey                 | Lokalise API key                                  | string           | -       |
| projectId              | Lokalise project id                               | string           | -       |
| outputDir              | Output directory for translations                 | string           | -       |
| process                | type of interaction with lokalise api             | 'keys' or 'files' |  -      |
| processesOptions       | options for processes                             | object | - |
| processesOptions.keys  | options for keys process | object | - |
| processesOptions.files | options for files process                         | string | - |

Possible options for [`processesOptions.keys`](https://developers.lokalise.com/reference/list-all-keys) and [`processesOptions.files`](https://developers.lokalise.com/reference/download-files) can be found in the Lokalise API documentation.

## Feature plans
- [ ] Node.js use case to enable expansion and customization of functionality
