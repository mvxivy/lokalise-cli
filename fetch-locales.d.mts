declare interface Config {
  apiKey: string;
  process: 'files' | 'keys';
  outputDir: string;
  projectId: string;
  branch?: string;
  processesOptions?: {
    files?: any;
    keys?: any;
  }
}

declare interface MergeBranchConfig {
  projectId: string;
  branchName: string;
  deleteBranch: boolean;
}

declare interface ProcessConfig {
  project_id: string;
  branch?: string;
  outputDir: string;
  options: any;
}
