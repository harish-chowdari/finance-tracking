import React, { useState } from "react";

const colourContext = React.createContext();

export const useColour = () => {
  return React.useContext(colourContext);
};

const ColourProvider = (props) => {
  const [protanopia, setProtanopia] = useState({
    avoid: ["red", "green", "brown", "orange"],
    use: ["blue", "yellow", "purple", "gray"],
  });

  const [deuteranopia, setDeuteranopia] = useState({
    avoid: ["red", "green", "brown", "orange"],
    use: ["blue", "yellow", "purple", "gray"],
  });

  const [tritanopia, setTritanopia] = useState({
    avoid: ["green", "blue", "yellow", "yellow"],
    use: ["red", "pink", "gray", "black"],
  });

  const [monochromacy, setMonochromacy] = useState({
    avoid: ["all colors"],
    use: ["black", "gray", "gray", "black"],
  });

  const [colour, setColour] = useState("red");

  return (
    <colourContext.Provider
      value={{
        colour,
        setColour,
        protanopia,
        setProtanopia,
        deuteranopia,
        setDeuteranopia,
        tritanopia,
        setTritanopia,
        monochromacy,
        setMonochromacy,
      }}
    >
      {props.children}
    </colourContext.Provider>
  );
};

export default ColourProvider;
