const getBitrefillApiKey = () => {
  return localStorage.getItem("bitrefillApiKey");
};

const setBitrefillApiKey = (apiKey: string) => {
  localStorage.setItem("bitrefillApiKey", apiKey);
};

const hasBitrefillApiKey = () => {
  return getBitrefillApiKey() !== null;
};

export { getBitrefillApiKey, setBitrefillApiKey, hasBitrefillApiKey };
