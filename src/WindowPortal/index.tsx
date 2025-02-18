import { CacheProvider } from "@emotion/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { getExpendWindow, setExpendWindow } from "../utlis/Utility";
interface WindowPortalProps {
  children: React.ReactNode;
  onClose?: () => void;
  title: string;
  portalKey: "longText" | "variable";
}

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  setTimeout(() => {
    const parentStylesheets = Array.from(sourceDoc?.styleSheets);
    const parentHead = document.head;
    const childHead = targetDoc.head;

    parentStylesheets.forEach((stylesheet) => {
      if (stylesheet.href) {
        // External stylesheet
        const newLink = targetDoc.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = stylesheet.href;
        childHead.appendChild(newLink);
      } else {
        // Inline stylesheet
        const newStyle = targetDoc.createElement("style");
        newStyle.innerHTML = Array.from(stylesheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
        childHead.appendChild(newStyle);
      }
    });
  }, 60);
}

function WindowPortal(
  { children, onClose, title, portalKey }: WindowPortalProps,
  ref: any
) {
  const childWindowRef = useRef<Window | null>(null);
  const isMount = useRef<boolean>(false);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      focusWindow: () => {
        if (childWindowRef.current) {
          childWindowRef.current.focus();
          setWindowdata();
        }
      },
      closeWindow: () => {
        if (childWindowRef.current) {
          setExpendWindow(null, portalKey);
          childWindowRef.current.close();
        }
      },
    }),
    []
  );
  const setDocumentTitle = () => {
    setTimeout(() => {
      if (childWindowRef.current && title) {
        childWindowRef.current.document.title = title;
      }
    }, 20);
  };
  useEffect(() => {
    setDocumentTitle();
  }, [title]);

  const setWindowdata = () => {
    if (childWindowRef.current) {
      childWindowRef?.current?.addEventListener(
        "beforeunload",
        closeChildWindow
      );
      childWindowRef?.current?.addEventListener(
        "keydown",
        handleDocumentKeyDown
      );
      childWindowRef.current.document.body.style.backgroundColor = "#f0f0f0";
      setIsWindowLoaded(true);
      setTimeout(() => {
        childWindowRef.current?.document &&
          copyStyles(window.document, childWindowRef.current?.document);
      }, 10);
    }
  };
  const openChildWindow = () => {
    const existsWindow = getExpendWindow(portalKey);
    if (existsWindow) {
      childWindowRef.current = existsWindow;
      setWindowdata();
      existsWindow.focus();
    } else {
      childWindowRef.current = window.open(
        "",
        "_blank",
        "location=no,width=1080,height=640,left=100,top=50"
      );
      setWindowdata();
      setDocumentTitle();
      setExpendWindow(childWindowRef.current, portalKey);
      childWindowRef.current?.focus();
    }
  };

  const closeChildWindow = () => {
    onClose && onClose();
    childWindowRef?.current?.removeEventListener(
      "keydown",
      handleDocumentKeyDown
    );
    setExpendWindow(null, portalKey);
    childWindowRef.current = null;
    return false;
  };
  const handleDocumentKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;
    if (e.ctrlKey) {
      console.log(e.which);
      var c = e.which || e.keyCode;
      if (c == 82) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };
  React.useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      openChildWindow();
    }
    return () => {
      window.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);

  return (
    isWindowLoaded &&
    childWindowRef.current &&
    ReactDOM.createPortal(
      <div className="lt-grid long-textwindow variable-window">{children}</div>,
      childWindowRef.current?.document?.body
    )
  );
}

export default forwardRef(WindowPortal);
