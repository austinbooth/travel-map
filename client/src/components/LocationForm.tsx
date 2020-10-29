import React, { useRef, useState, useEffect } from "react";
import * as api from "../api";

interface LocationFormProps {
  setCoords: (latitude: number, longitude: number) => void;
}

const LocationForm: React.FC<LocationFormProps> = (props) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [inputLocation, setInputLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Array<string> | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);

  useEffect(() => {
    if (inputLocation) {
      // set input element cursor position to the end
      locationInputRef.current!.selectionStart = locationInputRef.current!.value.length;
      locationInputRef.current!.selectionEnd = locationInputRef.current!.value.length;
    }
  });

  useEffect(() => {
    // ensure that if the input text is deleted, the active suggestion is reset to 0
    if (!suggestions) setActiveSuggestion(0);
  }, [suggestions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearFormAndChangeMapLocation(inputLocation);
  };

  const clearFormAndChangeMapLocation = (location: string) => {
    setInputLocation("");
    // const location = locationInputRef.current!.value;
    api
      .getLatLngFromName(location)
      .then(({ lat, lng }) => props.setCoords(lat, lng));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const entered = event.target.value;

    const locations = ["Prague", "Berlin", "Paris", "St Petersburg", "Split"];
    // const inputText = locationInputRef.current!.value;
    const possibleOptions = locations.filter((location) =>
      location.toLowerCase().includes(entered.toLowerCase())
    );
    possibleOptions.unshift(entered); // add whatever the user has typed as the first option
    if (entered.length === 0) setSuggestions(null);
    else setSuggestions(possibleOptions);
    setInputLocation(entered);
  };

  const onSuggestionClick = (event: React.MouseEvent<HTMLElement>) => {
    const selectedLocation = event.currentTarget.innerHTML;

    setInputLocation(selectedLocation);
    clearFormAndChangeMapLocation(selectedLocation);
    setSuggestions(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (suggestions === null) return;
    const { key: keyPressed } = event;

    if (keyPressed === "ArrowUp") {
      // decrement
      setActiveSuggestion((currentActiveSuggestion) => {
        return currentActiveSuggestion > 0 ? currentActiveSuggestion - 1 : 0;
      });
      setInputLocation(suggestions![activeSuggestion - 1]);
    }
    if (keyPressed === "ArrowDown") {
      // increment
      setActiveSuggestion((currentActiveSuggestion) =>
        currentActiveSuggestion < suggestions!.length - 1
          ? currentActiveSuggestion + 1
          : suggestions!.length - 1
      );
      setInputLocation(suggestions![activeSuggestion + 1]);
    }
    if (keyPressed === "Enter") {
      if (suggestions.length > 0)
        setInputLocation(suggestions![activeSuggestion]);
      setActiveSuggestion(0);
      setSuggestions(null);
    }
  };

  const onMouseHover = (event: React.MouseEvent<HTMLElement>) => {
    const optionHoveredOver = event.currentTarget.innerHTML;
    const indexOfOptionHoveredOver = suggestions!.indexOf(optionHoveredOver);
    setActiveSuggestion(indexOfOptionHoveredOver);
    setInputLocation(optionHoveredOver);
  };

  return (
    <div className="form-and-suggestions-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="location"
          name="location"
          ref={locationInputRef}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          value={inputLocation}
        ></input>
        <button type="submit">Find</button>
        {suggestions && (
          <ul className="suggestions">
            {suggestions.map((option, index) => (
              <li
                key={option}
                onClick={onSuggestionClick}
                onMouseEnter={onMouseHover}
                className={
                  index === activeSuggestion ? "active-suggestion" : undefined
                }
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default LocationForm;
