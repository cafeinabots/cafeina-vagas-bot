export interface PutHashtagsResponse {
  jobOpportunity: string;
  jobLevel: string;
  jobLocal: string;
  jobTitle?: string;
  jobUrl?: string;
  limitDate: string;
  footer: string;
  encerrada: boolean;
}

export interface RetrieveContentResponse {
  jobTitle: string;
  body: string;
}
