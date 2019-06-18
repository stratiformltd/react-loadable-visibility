module.exports = api => {
  const isTest = api.env("test");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          loose: true,
          ...(isTest ? { targets: { node: "current" } } : {})
        }
      ],
      "@babel/preset-react"
    ]
  };
};
