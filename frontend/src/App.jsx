import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { MapaRS } from "./components/MapaRS";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MapaRS />
    </>
  );
}

export default App;
