export const getTitleTags = (title: string) => {
  return [
    <title>{title}</title>,
    <meta property="og:title" content={title} key="ogtitle" />,
    <meta name="twitter:title" content={title} key="twittertitle" />,
  ];
};
