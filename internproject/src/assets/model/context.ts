
export type User = {
    userId: number;
    username: string;
  }
  
export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}