import { useState } from "react";
import "./styles.scss";
import Variables from "./Variables";
import WindowPositionVariable from "./WindowPositionVariable";

export default function App() {
  const [showWindow, setShowWindow] = useState(false)

  return (
    <div className="App">
      <Variables showWindow={showWindow} setShowWindow={setShowWindow} />
      <WindowPositionVariable setShowWindow={setShowWindow} showWindow={showWindow} />
    </div>
  );
}
