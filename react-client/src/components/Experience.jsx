import React, { useState, useEffect } from "react";
import axios from "axios";

const Experience = () => {
  const [repos, setrepos] = useState([]); // State untuk menyimpan list repo
  const [loading, setLoading] = useState(true); // State untuk loading indicator
  const [error, setError] = useState(null); // State untuk error handling

  // Gunakan useEffect untuk memanggil GitHub API saat komponen dimount
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true); // Mulai loading
        const response = await axios.get(
          "https://api.github.com/users/facebook/repos"
        );
        setrepos(response.data); // Set repos dari data yang diterima
      } catch (err) {
        setError("repo error"); // Error handling
      }
    };

    fetchRepos();
  }, []);

  return (
    <div>
      <h1>My GitHub Repositories</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience;
