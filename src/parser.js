export default (xmlContent) => {
  const parser = new DOMParser();
  try {
    const htmlContent = parser.parseFromString(xmlContent, 'application/xml');
    return htmlContent;
  } catch (err) {
    throw new Error(err);
  }
};
