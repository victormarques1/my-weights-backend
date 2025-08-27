export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
  };

  constructor(token: string, user: any) {
    this.access_token = token;
    this.user = {
      id: user.id,
      email: user.email,
    };
  }
}
