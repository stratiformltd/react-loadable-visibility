export let isBot = false;

const loadableConfig = {
  setIsBot(value) {
    isBot = value;
    return isBot;
  },
};

Object.freeze(loadableConfig);
export default loadableConfig;
