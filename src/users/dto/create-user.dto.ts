export class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    role: 'Admin' | 'Learner' | 'Instructor';
  }
  