import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeederService {
  constructor(private readonly usersService: UsersService) {}

  async seed() {
    const user = await this.usersService.findByEmail('admin@example.com');
    if (!user) {
      const password = await bcrypt.hash('admin123', 10);
      await this.usersService.create({
        username: 'admin',
        email: 'admin@example.com',
        fullname: 'Administrator',
        password_hash: password,
        role: UserRole.Admin,
      });
      console.log('✅ Admin account seeded');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  }
}
