
export interface Source {
  uri: string;
  title: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
