import { useEffect, useState } from 'react';

// Define a more specific type for the expected data structure
interface GitHubProfile {
  name?: string;
  avatar_url?: string;
  bio?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  html_url?: string;
  // Add other properties you expect from the GitHub API
}

interface ErrorState {
  message: string;
}

export const Profile = () => {
  const [data, setData] = useState<GitHubProfile | null>(null); // Initialize as null to represent no data yet
  const [hasError, setHasError] = useState<ErrorState | null>(null); // More specific error type
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    async function handleFetch() {
      setIsFetching(true);
      setHasError(null); // Reset error state on new fetch attempt
      try {
        const response = await fetch(`https://api.github.com/users/Shameeza-Akbar`);
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
  }, []);

  if (hasError) {
    return <h1>Error: {hasError.message}</h1>;
  }

  if (isFetching) {
    return <h1>Loading...</h1>;
  }

  return data ? (
    <div>
      {data.name && <h1>{data.name}</h1>}
      {data.avatar_url && (
        <img
          src={data.avatar_url}
          alt={`${data.name || 'User'} avatar`} // More descriptive alt text
          style={{ width: '150px', borderRadius: '50%' }}
        />
      )}
      {data.name && <p>Username: {data.name}</p>}
      {data.bio && <p>Bio: {data.bio}</p>}
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
    </div>
  ) : (
    <h1>No user data found</h1>
  );
};