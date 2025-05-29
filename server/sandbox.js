// index.js
const express = require("express");
const { generateContent } = require("./lib/gemini.api");
const app = express();

const prompt1 = `
    I like detective movie. so generate a new movie for me with following details:

    genreId is one of the following:
    [
      {
        "id": 1,
        "name": "Animation"
        },
      {
        "id": 2,
        "name": "Fantasy"
      },
      {
        "id": 3,
        "name": "Sci-Fi"
      }
    ]
    `;

const userPesona = {
  name: "John Doe",
  age: 30,
  gender: "Male",
  moviePreferences: {
    highlyRated: true,
    genreInterests: ["Animation", "Fantasy", "Sci-Fi"],
  },
};

// 1. kita get all movies dari database
const dataMovies = require("../data/movies.json").map((movie) => ({
  id: movie.id,
  title: movie.title,
}));
const prompt2 = `
I want you to recommend the user with top 3 movies

from the list below:
${dataMovies.map((movie) => `- ${movie.title} (ID: ${movie.id})`).join("\n")}

based on the following criteria:
- Highly rated
- Genre: Sci-Fi, Fantasy, Animation
- For Girl

Response with Array of ID
`;

app.get("/", async (req, res) => {
  console.log("Received request with user persona:", userPesona);
  console.log("Prompt for generation:", prompt2);

  const generation = await generateContent(prompt2);

  const parsedOutput = JSON.parse(generation);

  console.log("Generation:", parsedOutput);

  // await Movie.findAll({ where: { id: { [Op.in]: parsedOutput } } })
  // Select * from movies where id in (22, 13, 50)
  const movies = require("../data/movies.json").filter((movie) =>
    parsedOutput.includes(movie.id)
  );

  res.json({
    message: "Hello from Gemini API",
    generation: parsedOutput,
    movies,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));