import { useEffect, useState } from "react";
export const Profile = () => {
  const [data, setData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    async function handleFetch() {
      setIsFetching(true);
      try {
        const response = await fetch(
          `https://api.github.com/users/Shameeza-Akbar`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const resData = await response.json();
        setData(resData);
      } catch (error) {
        setHasError({ message: error.message || "Try again later" });
      }
      setIsFetching(false);
    }
    handleFetch();
  }, []);
  if (hasError) {
    return <h1>Error Occurred</h1>;
  }
  if (isFetching) {
    return <h1>Loading...</h1>;
  }
  return data ? (
    <div>
      <h1>{data.name}</h1>
      <img
        src={data.avatar_url}
        alt="avatar"
        style={{ width: "150px", borderRadius: "50%" }}
      />
      <p>Username: {data.name}</p>
      {data.bio && <p>Bio: {data.bio}</p>}
      {data.followers !== undefined && <p>Followers: {data.followers}</p>}
      {data.following !== undefined && <p>Following: {data.following}</p>}
      {data.public_repos !== undefined && (
        <p>Public Repositories: {data.public_repos}</p>
      )}
      {data.html_url && (
        <p>
          GitHub Profile:{" "}
          <a href={data.html_url} target="_blank">
            {data.html_url}
          </a>
        </p>
      )}
    </div>
  ) : (
    <h1>No data found</h1>
  );
};
