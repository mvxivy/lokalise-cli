#!/usr/bin/env node
import { LokaliseApi } from '@lokalise/node-api';
import { fetchLocales } from "./lib/fetch-locales.mjs";
import { getConfigFromFile } from './lib/config.mjs';
import { branchProcess } from './lib/branch-process.mjs';

async function main(config) {
  if (!config) {
    config = await getConfigFromFile();
  }

  const lokalise = new LokaliseApi({ apiKey: config.apiKey });

  await branchProcess(lokalise, config);
  await fetchLocales(lokalise, config);
}

main();
