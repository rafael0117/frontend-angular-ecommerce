export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
  expiresIn?: number;
}
