import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({ ...userData, password: hashedPassword });
    return user.save();
  }

  async login(loginData: any) {
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}