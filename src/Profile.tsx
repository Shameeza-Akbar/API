import { useEffect, useState, useRef } from 'react';

// Define a more specific type for the expected data structure
interface GitHubProfile {
  name?: string;
  email: string | null;
  avatar_url?: string;
  bio?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  html_url?: string;
  location: string | null;
  // Add other properties you expect from the GitHub API
}

interface ErrorState {
  message: string;
}

export const Profile = () => {
  const [data, setData] = useState<GitHubProfile | null>(null); // Initialize as null to represent no data yet
  const [hasError, setHasError] = useState<ErrorState | null>(null); // More specific error type
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Shameeza-Akbar");
  const input = useRef("")
  useEffect(() => {
    async function handleFetch() {
      setIsFetching(true);
      setHasError(null); // Reset error state on new fetch attempt
      try {
        const response = await fetch(`https://api.github.com/users/${userName}`);
        if (!response.ok) {
          const errorData = await response.json(); // Try to get more specific error info from the API
          throw new Error(errorData?.message || `Failed to fetch data: ${response.status}`);
        }
        const resData: GitHubProfile = await response.json();
        setData(resData);
      } catch (error: any) { // Use 'any' or 'Error' for broader error capture
        setHasError({ message: error.message || 'Try again later' });
      } finally {
        setIsFetching(false);
      }
    }

    handleFetch();
  }, [userName]);
function handleSubmit(event){
  event.preventDefault()
  let uName= input.current.value;
  setUserName(uName)
}
  if (hasError) {
    return <div>
    <form onSubmit={handleSubmit}>
        <label>Search Profile: </label>
        <input type='text' placeholder='Username' name='user' ref={input}></input>
        <button>Search</button>
      </form>
  
      
      <h1>{hasError.message}</h1>
    </div>
  }

  if (isFetching) {
    return <h1>Loading...</h1>;
  }
  if (data){
  return <div>
      <form onSubmit={handleSubmit}>
        <label>Search Profile: </label>
        <input type='text' placeholder='Username' name='user' ref={input}></input>
        <button>Search</button>
      </form>
      {data.name && <h1>{data.name}</h1>}
      {data.avatar_url && (
        <img
          src={data.avatar_url}
          alt={`${data.name || 'User'} avatar`} // More descriptive alt text
          style={{ width: '150px', borderRadius: '50%' }}
        />
      )}
      {data.name && <p>Username: {data.name}</p>}
      {data.email && <p>Email: {data.email}</p>}
      {data.bio && <p>Bio: {data.bio}</p>}
      {data.location && <p>Location: {data.location}</p>}
      {typeof data.followers === 'number' && <p>Followers: {data.followers}</p>}
      {typeof data.following === 'number' && <p>Following: {data.following}</p>}
      {typeof data.public_repos === 'number' && (
        <p>Public Repositories: {data.public_repos}</p>
      )}
      {data.html_url && (
        <p>
          GitHub Profile:{' '}
          <a href={data.html_url} target="_blank" rel="noopener noreferrer">
            {data.html_url}
          </a>
        </p>
      )}
    </div>}
};