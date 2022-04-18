import React from "react";
import loadableConfig from "./isBotSingleton";

export default function createLoadable(importFunction, opts, normalLoadable) {
  function LoadableComponent(props) {
    //if isBot is true it means bot is accessing the page. Pass ssr true in such case
    if (loadableConfig?.getIsBot()) {
      let Loadable = normalLoadable(importFunction, {
        ssr: true,
        fallback: opts?.fallback,
      });
      return <Loadable {...props} />;
    }
    // else return loadable component as it is with original opts
    else {
      let Loadable = normalLoadable(importFunction, {
        ssr: opts?.ssr,
        fallback: opts?.fallback,
      });
      return <Loadable {...props} />;
    }
  }
  return LoadableComponent;
}
