import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';
import { getUserBy, upsertUser } from '../../data/users';
import { UserDto } from '../../common/dto/user.dto';
import crypto from 'crypto';

function getGravatarUrl(email: string): string {
  const hash = crypto
    .createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
}

type ToggleAvatarRequest = {
  useGravatar: boolean;
};

export const toggleAvatarHandler: ApiHandler<ToggleAvatarRequest> = async (event, context) => {
  try {
    const { useGravatar } = event.parsedBody || {};

    if (typeof useGravatar !== 'boolean') {
      return error('Invalid request body: useGravatar must be a boolean', 400);
    }

    const auth0Id = context.user?.auth0Id;
    if (!auth0Id) {
      return error('Unauthorized', 401);
    }

    const currentUser = await getUserBy('auth0Id', auth0Id);
    if (!currentUser) {
      return error('User not found', 404);
    }

    const avatarUrl = useGravatar ? getGravatarUrl(currentUser.email) : context.user?.picture;

    const userDto: UserDto = new UserDto({
      _id: currentUser._id,
      avatar: avatarUrl,
    });

    const updatedUser = await upsertUser(userDto);

    return success({
      data: updatedUser,
    });
  } catch (e) {
    return error((e as Error).message, 500);
  }
};
