export const providers = {
  slack: {
    icon: 'slack',
    url: 'https://coding-coach.slack.com/team/{id}',
  },
  email: {
    icon: 'at',
    url: 'mailto:{id}',
  },
  linkedin: {
    icon: 'linkedin',
    inputIcon: 'linkedin-square',
    url: 'https://www.linkedin.com/in/{id}',
  },
  facebook: {
    icon: 'facebook',
    inputIcon: 'facebook-square',
    url: 'https://www.facebook.com/{id}',
  },
  twitter: {
    icon: 'twitter',
    inputIcon: 'twitter-square',
    url: 'https://twitter.com/{id}',
  },
  github: {
    icon: 'github',
    url: 'https://github.com/{id}',
  },
  website: {
    icon: 'globe',
    url: 'https://{id}',
  },
};

export function getChannelInfo(channel) {
  const { type, id } = channel;
  const { icon, url: providerUrl } = providers[type];
  const idPh = '{id}';
  return {
    icon,
    url: providerUrl.replace(idPh, id),
  };
}
