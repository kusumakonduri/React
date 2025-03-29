import React, { useEffect, useState } from "react";
import "./App.css";
import Recipe from "./Recipe";

const App = () => {
  const APP_ID = "13870fca";
  const APP_KEY = "24910556efaf7533486bb8e06d0dc2a5";

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("chicken");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.hits) {
          throw new Error("Invalid API response: 'hits' is undefined");
        }

        setRecipes(data.hits);
      } catch (error) {
        setError(error.message);
        setRecipes([]); 
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, [query]);

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    setQuery(search);
    setSearch("");
  };

  return (
    <div className="App">
      <form className="search-form" onSubmit={getSearch}>
        <input className="search-bar" type="text" value={search} onChange={updateSearch} />
        <button className="search-button" type="submit">Search</button>
      </form>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="recipes">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Recipe
              key={recipe.recipe.uri}
              title={recipe.recipe.label}
              calories={recipe.recipe.calories}
              image={recipe.recipe.image}
              ingredients={recipe.recipe.ingredients}
            />
          ))
        ) : (
          !loading && <p>No recipes found. Try another search!</p>
        )}
      </div>
    </div>
  );
};

export default App;
