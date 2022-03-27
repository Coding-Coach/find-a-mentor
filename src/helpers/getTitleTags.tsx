/**
 * It has to be a function that returns an array of tags otherwise the tags would rendered in both app and page level
 */
export const getTitleTags = (title: string) => {
  return [
    <title key="title">{title}</title>,
    <meta property="og:title" content={title} key="ogtitle" />,
    <meta name="twitter:title" content={title} key="twittertitle" />,
  ];
};
