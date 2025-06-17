#!/usr/bin/env node
import { LokaliseApi } from '@lokalise/node-api';
import { fetchLocales } from "./lib/fetch-locales.mjs";
import { getConfigFromFile } from './lib/config.mjs';
import { branchProcess } from './lib/branch-process.mjs';
import process from 'node:process';

async function main(config) {
  if (!config) {
    config = await getConfigFromFile();
  }

  const lokalise = new LokaliseApi({ apiKey: config.apiKey });

  await branchProcess(lokalise, config);
  await fetchLocales(lokalise, config);
}

main();

function gracefulShutdown(error) {
  setTimeout(() => process.exit(error ? 1 : 0), 100);
}

process.on('uncaughtException', gracefulShutdown);
process.on('unhandledRejection', gracefulShutdown);
process.on('SIGINT', () => gracefulShutdown());
process.on('SIGTERM', () => gracefulShutdown());
