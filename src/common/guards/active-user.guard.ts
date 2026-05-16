import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    if (user.isDisabled) {
      throw new ForbiddenException('Your account has been disabled');
    }

    return true;
  }
}