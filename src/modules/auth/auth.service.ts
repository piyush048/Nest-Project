import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { hashPassword, verifyPassword } from '../../common/utils/hash.util';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async loginWithEmail(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload : JwtPayload = { userId: (user as any)._id.toString() };
    return {
      accessToken: this.jwtService.signAsync(payload),
      // refreshToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRY }),
      user: { id: user._id, email: user.email, name: user.name },
    };
  }

  async signupWithEmail(signupDto: SignupDto) {
    const existingUser = await this.userService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    console.log("In User service 2");
    const hashedPassword = await hashPassword(signupDto.password);
    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });
    console.log("In User service 3");
    const payload : JwtPayload = { userId: (user as any)._id.toString() };
    console.log("In User service", payload);
    return {
      accessToken: this.jwtService.signAsync(payload),
      // refreshToken: this.jwtService.signAsync(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRY }),
      user: { id: user._id, email: user.email, name: user.name },
    };
  }
}