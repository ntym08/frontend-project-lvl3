import _ from 'lodash';

export default (xmlContent, url) => {
  const parser = new DOMParser();
  const htmlContent = parser.parseFromString(xmlContent, 'application/xml');
  const channel = htmlContent.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feed = {
    id: _.uniqueId(),
    title: feedTitle,
    description: feedDescription,
    url,
  };
  const posts = Array.from(channel.querySelectorAll('item')).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const post = {
      id: _.uniqueId(),
      feedId: feed.id,
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
    return post;
  });
  return { feed, posts };
};
