export const getAvatarUrl = avatar => {
  if (avatar?.startsWith('/avatars/')) {
    console.log(process.env)
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}${avatar}`;
  }
  return avatar;
};
