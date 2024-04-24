"use client";
import fetchDataFromAPI from "../api/deeptrust/route";
import fetchDeeptrust from "../api/deeptrust/recognise";

export default function Page() {
  const deeptrust = async () => {
    const symbioticConnection = await fetchDeeptrust();
    console.log(symbioticConnection);
    return symbioticConnection;
  };
  return (
    <div>
      <button onClick={deeptrust}>Connect to Deeptrust</button>
      <h1>Connection</h1>
    </div>
  );
}
