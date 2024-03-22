import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
      setMatches(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
