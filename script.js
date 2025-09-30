const fs = require('fs')

class MovieRecommendationSystem {
    constructor() {
        this.movieData = JSON.parse(fs.readFileSync('movieList.json'));
    }

    getAverageRating() {
        const totalRating = this.movieData.movies.reduce((acc, movie) => acc + movie.rating, 0);
        return totalRating / this.movieData.movies.length;
    }

    getMoviesByGenre(genre) {
        return this.movieData.movies.filter(movie => movie.genre === genre);
    }

    getHighestRatedMovie() {
        const highestRatedMovie = this.getAverageRating();

        this.movieData.movies.forEach(movie => {
            if (movie.rating >= highestRatedMovie) {
                console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
                console.log("-------------------------------------------------------------------------");
            };
        });
    }

    groupMoviesByDecade() {
        const decades = {};
        this.movieData.movies.forEach(movie => {
            const decade = Math.floor(movie.year / 10) * 10;
            if (!decades[decade]) {
                decades[decade] = [];
            }
            decades[decade].push(movie);
        });
        return decades;
    }

    async fetchAdditionalMovies() {
        const response = await new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        "title": "Extraction",
                        "genre": "Action",
                        "rating": 9.5,
                        "year": 2020
                    },
                    {
                        "title": "Inception",
                        "genre": "Sci-Fi",
                        "rating": 7.5,
                        "year": 2010
                    }
                ]);
            }, 2000);
        });

        // const data = await fs.readFile('movieList.json', );
        // const movieList = JSON.parse(data);

        let resultAdded = [];
        let resultExisted = [];

        for (const movie in response) {
            const existingMovie = this.movieData.movies.find(m => m.title === response[movie].title);
            if (!existingMovie) {
                this.movieData.movies = this.movieData.movies.concat(response[movie]);
                await fs.writeFileSync('movieList.json', JSON.stringify(this.movieData, null, 2));
                // console.log(`Added movie: ${response[movie].title}`);
                resultAdded.push(response[movie].title);
            } else {
                // console.log(`Movie already exists: ${response[movie].title}`);
                resultExisted.push(response[movie].title);
            }
        }
        
        // DISPLA
        if (resultAdded.length >= 1) {
            console.log("\n\n--------------------------- NEW ADDED MOVIE -----------------------------");
            for (let x = 0; x < resultAdded.length; x++) {
                console.log(`Added movie: ${resultAdded[x]}`);
            }
        }

        if (resultExisted.length >= 1) {
            console.log("\n\n------------------------ ALREADY EXISTED MOVIE --------------------------");
            for (let x = 0; x < resultExisted.length; x++) {
                console.log(`Already existed movie: ${resultExisted[x]}`);
            }
        }
    }

    printMovies() {            
        console.log("----------------------------- MOVIE LIST --------------------------------\n");
        this.movieData.movies.forEach(movie => {
            console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
            console.log("-------------------------------------------------------------------------");
        });
    }
}

async function main() {
    const movieSystem = new MovieRecommendationSystem();

    console.log("-------------------------- INITIAL MOVIE LIST ---------------------------");
    movieSystem.printMovies();

    console.log("\nAverage Rating:", movieSystem.getAverageRating());

    console.log("\n---------------------------- ACTION MOVIES ------------------------------\n");
    const actionMovies = movieSystem.getMoviesByGenre("Action");

    actionMovies.forEach(movie => {
        console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
        console.log("-------------------------------------------------------------------------");
    });

    console.log("\n---------------------------- COMEDY MOVIES ------------------------------\n");
    const comedyMovies = movieSystem.getMoviesByGenre("Comedy");
    
    comedyMovies.forEach(movie => {
        console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
        console.log("-------------------------------------------------------------------------");
    });

    console.log("\n---------------------------- SCI-FI MOVIES ------------------------------\n");
    const scifiMovies = movieSystem.getMoviesByGenre("Sci-Fi");
    
    scifiMovies.forEach(movie => {
        console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
        console.log("-------------------------------------------------------------------------");
    });

    console.log("\n-------------------------- HIGHEST-RATED MOVIES -------------------------");
    console.log("-------------------------- RECOMMENDED MOVIES ---------------------------\n");
    movieSystem.getHighestRatedMovie();

    console.log("\n--------------------------- MOVIES BY DECADE ----------------------------");
    const moviesByDecade = movieSystem.groupMoviesByDecade();
    Object.keys(moviesByDecade).forEach(decade => {
        // console.log(`Decade: ${decade}s`);
        console.log(`\n---------------------------- Decade: ${decade}s -----------------------------`);
        moviesByDecade[decade].forEach(movie => {
            console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
            console.log("-------------------------------------------------------------------------");
        });  
    });

    movieSystem.fetchAdditionalMovies();
    console.log("\n-------------------------- UPDATED MOVIE LIST ---------------------------");
    movieSystem.printMovies();
}

main();