export default interface User {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  name: string;
  role: string[];
  user_id: number;
}
