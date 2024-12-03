# Lokalise CLI

This script is used to download translations from Lokalise to your project and update. 

## Installation

```bash
npm install -D @mvxivy/lokalise-cli
```

## Usage

#### CLI 
```bash
ltu
```

#### Node.js
```javascript
import { fetchLocales } from "@mvxivy/lokalise-cli";

const config = {
  apiKey: '<your api key>',
  projectId: '<your project id>',
  outputDir: '<output directory>',
  // ... other options
}

fetchLocales(config);
```

## Configuration
If you use cli method, you can create a `.lokalise.json` file in the root of your project and add the following configuration options.

If you want use it as node.js script package, you can pass the configuration object as an argument to the `fetchLocales` function.

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
