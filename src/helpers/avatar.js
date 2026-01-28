export const getAvatarUrl = (avatar) => {
  if (avatar?.startsWith('/avatars/')) {
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}${avatar}`;
  }
  return avatar;
};
