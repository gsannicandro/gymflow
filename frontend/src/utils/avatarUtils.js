export const getAvatarColor = (userId) => {
  if (!userId) return '#a3e635';
  const pastelColors = ['#fecaca', '#fde047', '#a3e635', '#6ee7b7', '#93c5fd', '#c4b5fd', '#fbcfe8', '#fed7aa'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return pastelColors[hash % pastelColors.length];
};
