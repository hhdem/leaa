import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { JwtStrategy } from '@leaa/api/src/strategies';

import { AuthResolver } from '@leaa/api/src/modules/auth/auth.resolver';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), AuthTokenModule],
  providers: [
    AuthResolver,
    AuthService,
    UserResolver,
    UserService,
    RoleService,
    PermissionService,
    JwtStrategy,
    UserProperty,
  ],
  exports: [AuthService],
})
export class AuthModule {}
