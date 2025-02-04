import { LokaliseApi } from '@lokalise/node-api';
import { processFiles } from './lib/process-files.mjs';
import { processKeys } from './lib/process-keys.mjs';
import { selectProcess } from './lib/utils.mjs';
import {getConfigFromFile, setupProcessConfig} from './lib/config.mjs';

/**
 * @param config {Config}
 * @returns {Promise<void>}
 */
export const fetchLocales = async (config) => {
  if(!config) {
    config = await getConfigFromFile();
  }

  const lokalise = new LokaliseApi({ apiKey: config.apiKey });

  const processConfig = setupProcessConfig(config);

  const processMap = {
    files: processFiles,
    keys: processKeys,
  };

  const process = selectProcess(processMap, config.process);

  try{
    await process(lokalise, processConfig);
  } catch(error) {
    console.error(error);
  }
};
