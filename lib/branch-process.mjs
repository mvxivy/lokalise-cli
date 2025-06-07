import { consola } from 'consola';
import { mergeBranch } from './merge-branch.mjs';

/**
 * @param lokalise {LokaliseApi}
 * @param config {Config}
 * @returns {Promise<void>}
 */
export const branchProcess = async (lokalise, config) => {
  const branch = await consola
    .prompt('Select branch', {
      type: 'text',
      placeholder: 'master',
    })
    .then((value) => value ?? config.branch ?? 'master');

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
    }
  }
}
