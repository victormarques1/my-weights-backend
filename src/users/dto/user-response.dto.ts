export class UserResponseDto {
  id: number;
  name: string;
  email: string;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
