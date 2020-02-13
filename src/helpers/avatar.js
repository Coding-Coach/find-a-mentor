export const getAvatarUrl = avatar => {
  if(avatar.startsWith("/avatars/")){
    return `${process.env.REACT_APP_API_ENDPOINT}${avatar}`;
  }
  return avatar;
}