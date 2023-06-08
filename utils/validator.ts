export const isValidTimestamp = async (timestamp) => {
  const parsedTimestamp = parseInt(timestamp, 10);

  if (isNaN(parsedTimestamp)) {
    return false;
  }

  const date = new Date(parsedTimestamp);
  const isInvalidDate = isNaN(date.getTime());

  return !isInvalidDate;
};
