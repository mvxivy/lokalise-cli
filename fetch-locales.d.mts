declare interface Config {
  apiKey: string;
  process: 'files' | 'keys';
  outputDir: string;
  projectId: string;
  branch?: string;
}

declare interface ProcessConfig {
  project_id: string;
  branch?: string;
  outputDir: string;
  options: any;
}
