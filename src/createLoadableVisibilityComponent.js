import React, { useEffect, useState, useRef } from "react";
import { IntersectionObserver } from "./capacities";

let intersectionObserver;
const trackedElements = new Map();

if (IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        const visibilityHandler = trackedElements.get(entry.target);

        if (
          visibilityHandler &&
          (entry.isIntersecting || entry.intersectionRatio > 0)
        ) {
          visibilityHandler();
        }
      });
    }
  );
}

function createLoadableVisibilityComponent(
  args,
  { Loadable, preloadFunc, LoadingComponent }
) {
  let preloaded = false;
  const visibilityHandlers = [];

  const LoadableComponent = Loadable(...args);

  function LoadableVisibilityComponent(props) {
    const visibilityElementRef = useRef();
    const [isVisible, setVisible] = useState(preloaded);

    function visibilityHandler() {
      if (visibilityElementRef.current) {
        intersectionObserver.unobserve(visibilityElementRef.current);
        trackedElements.delete(visibilityElementRef.current);
      }

      setVisible(true);
    }

    useEffect(() => {
      if (!isVisible && visibilityElementRef.current) {
        visibilityHandlers.push(visibilityHandler);

        trackedElements.set(visibilityElementRef.current, visibilityHandler);
        intersectionObserver.observe(visibilityElementRef.current);

        return () => {
          const handlerIndex = visibilityHandlers.indexOf(visibilityHandler);

          if (handlerIndex >= 0) {
            visibilityHandlers.splice(handlerIndex, 1);
          }

          intersectionObserver.unobserve(visibilityElementRef.current);
          trackedElements.delete(visibilityElementRef.current);
        };
      }
    }, [isVisible, visibilityElementRef.current]);

    if (isVisible) {
      return <LoadableComponent {...props} />;
    }

    if (LoadingComponent) {
      return (
        <div
          style={{
            display: "inline-block",
            minHeight: "1px",
            minWidth: "1px"
          }}
          {...props}
          ref={visibilityElementRef}
        >
          {React.createElement(LoadingComponent, {
            isLoading: true
          })}
        </div>
      );
    }

    return (
      <div
        style={{ display: "inline-block", minHeight: "1px", minWidth: "1px" }}
        {...props}
        ref={visibilityElementRef}
      />
    );
  }

  LoadableVisibilityComponent[preloadFunc] = () => {
    if (!preloaded) {
      preloaded = true;
      visibilityHandlers.forEach(handler => handler());
    }

    return LoadableComponent[preloadFunc]();
  };

  return LoadableVisibilityComponent;
}

export default createLoadableVisibilityComponent;
