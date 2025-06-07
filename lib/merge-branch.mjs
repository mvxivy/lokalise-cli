/**
 *
 * @param lokalise {LokaliseApi}
 * @param config { MergeBranchConfig }
 * @returns {Promise<void>}
 */
export const mergeBranch = async (lokalise, { branchName, deleteBranch, projectId }) => {
  if (branchName === 'master') return;
  /**
   * @type {PaginatedResult<Branch>}
   */
  const branches = await lokalise.branches().list({ project_id: projectId });
  const branch = branches.items.find((branch) => branch.name === branchName);
  await lokalise.branches().merge(branch.branch_id, { project_id: projectId });
  if (deleteBranch) {
    await lokalise.branches().delete(branch.branch_id, { project_id: projectId });
  }
};
