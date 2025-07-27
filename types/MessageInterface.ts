type Sender = 'user' | 'ai';

export interface MessageInterface {
  id: string;
  text: string;
  sender: Sender;
}