import { consola } from 'consola';
import { processFiles } from './process-files.mjs';
import { processKeys } from './process-keys.mjs';
import { selectProcess } from './utils.mjs';
import { setupProcessConfig } from './config.mjs';

/**
 * @param lokalise {LokaliseApi}
 * @param config {Config}
 * @returns {Promise<void>}
 */
export const fetchLocales = async (lokalise, config) => {
  const processConfig = setupProcessConfig(config);

  const processMap = {
    files: processFiles,
    keys: processKeys,
  };

  const process = selectProcess(processMap, config.process);

  try {
    consola.start('Fetching locales...');
    await process(lokalise, processConfig);
    consola.success('Locales updated successfully!');
  } catch (error) {
    consola.error('Update locales process was failed:\n', error);
  }
};
