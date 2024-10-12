import React, { useState } from "react";

const colourContext = React.createContext();

export const useColour = () => {
  return React.useContext(colourContext);
};

const ColourProvider = (props) => {
  const [protanopia, setProtanopia] = useState({
    use: ["red", "green", "brown", "orange"],
    avoid: ["blue", "yellow", "purple", "gray"],
  });

  const [deuteranopia, setDeuteranopia] = useState({
    use: ["red", "green", "brown", "orange"],
    avoid: ["blue", "yellow", "purple", "gray"],
  });

  const [tritanopia, setTritanopia] = useState({
    use: ["blue", "yellow", "green"],
    avoid: ["red", "pink", "gray", "black"],
  });

  const [monochromacy, setMonochromacy] = useState({
    use: ["all colors"],
    avoid: ["black", "white", "gray"],
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
