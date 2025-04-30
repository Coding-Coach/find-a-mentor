export const buildSlackURL = (slackId: string | undefined) => {
  if (!slackId) {
    return null;
  }
  return `https://coding-coach.slack.com/team/${slackId}`;
}

export const buildMailToURL = (email: string) => {
  return `mailto:${email}`;
}
