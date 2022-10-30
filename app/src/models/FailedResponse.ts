export interface FailedResponse {
  detail: string;
  code: string;
  messages: FailedMessage[];
}

export interface FailedMessage {
  token_class: string;
  token_type: string;
  message: string;
}
