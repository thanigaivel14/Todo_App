const dev_env = process.env.NODE_ENV === "production";
const istOffset = dev_env ? 5.5 * 60 * 60 * 1000 : 0;
const getISTDate = () => {
  const now = new Date();
  const istNow = new Date(now.getTime() + istOffset);
  return istNow.toISOString().split('T')[0];
};

const getISTHour = () => {
  const now = new Date();
  const istNow = new Date(now.getTime() + istOffset);
  return istNow.getUTCHours();
};

export { getISTDate, getISTHour };