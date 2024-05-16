// import {
//    useEffect,
//   useState,
// } from "react";

const TextShine = ({ text }: { text: string }) => {
  // const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((prevIndex) => (prevIndex + 1) % texts.length);
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [texts]);

  return (
    <span className="text-md inline-flex animate-background-shine bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text text-center text-transparent lg:text-xl">
      {/* {texts[index]} */}
      {text}
    </span>
  );
};

export default TextShine;
