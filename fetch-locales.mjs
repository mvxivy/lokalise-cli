import { LokaliseApi } from '@lokalise/node-api';
import { consola } from 'consola';
import { processFiles } from './lib/process-files.mjs';
import { processKeys } from './lib/process-keys.mjs';
import { selectProcess } from './lib/utils.mjs';
import { getConfigFromFile, setupProcessConfig } from './lib/config.mjs';
import { mergeBranch } from './lib/merge-branch.mjs';

/**
 * @param config {Config}
 * @returns {Promise<void>}
 */
export const fetchLocales = async (config) => {
  if (!config) {
    config = await getConfigFromFile();
  }

  const lokalise = new LokaliseApi({ apiKey: config.apiKey });

  const processConfig = setupProcessConfig(config);

  const branch = await consola
    .prompt('Select branch', {
      type: 'text',
      placeholder: 'master',
    })
    .then((value) => value ?? 'master');

  if(branch !== 'master') {
    const deleteAfterMerge = await consola.prompt('Delete branch after merge?', {
      type: 'confirm',
      default: true,
    })

    /**
     * @type {{ MergeBranchConfig }}
     */
    const mergeBranchConfig = {
      projectId: config.projectId,
      branchName: branch,
      deleteBranch: deleteAfterMerge,
    }

    try {
      consola.start('Merging branch...');
      await mergeBranch(lokalise, mergeBranchConfig);
      consola.success('Branch merged successfully!');
    } catch (error) {
      consola.error('Merge branch failed:\n', error);
      return;
    }
  }

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
