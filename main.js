class MovieRecommendationSystem {
    constructor(movies) {
        this.movies = movies;
    }
    getAverageRating() {
        const totalRating = this.movies.reduce((acc, movie) => acc + movie.rating, 0);
        return totalRating / this.movies.length;
    }
    getMoviesByGenre(genre) {
        return this.movies.filter(movie => movie.genre === genre);
    }
    getHighestRatedMovie() {
        return this.movies.reduce((max, movie) => max.rating > movie.rating ? max : movie, this.movies[0]);
    }
    groupMoviesByDecade() {
        const decades = {};
        this.movies.forEach(movie => {
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
                        "title": "Titanic",
                        "genre": "Romance",
                        "rating": 8.5,
                        "year": 2020
                    },
                    {
                        "title": "Mr. Bean",
                        "genre": "Comedy",
                        "rating": 7.5,
                        "year": 2015
                    }
                ]);
            }, 2000);
        });
        this.movies = this.movies.concat(response);
    }
    printMovies() {
        console.log("---------- Movie List ----------");
        this.movies.forEach(movie => {
            console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
        });
    }
}
async function main() {
    const movieData = [
        {
            "title": "Old Guard",
            "genre": "Action",
            "rating": 8.0,
            "year": 2010
        },
        {
            "title": "Tom and Jerry",
            "genre": "Comedy",
            "rating": 7.0,
            "year": 2005
        },
        {
            "title": "Transformer",
            "genre": "Action",
            "rating": 9.0,
            "year": 1995
        }
    ];
    const movieSystem = new MovieRecommendationSystem(movieData);
    console.log("---------- Initial Movie List ----------");
    movieSystem.printMovies();
    console.log("\nAverage Rating:", movieSystem.getAverageRating());
    console.log("\n---------- Action Movies ----------");
    const actionMovies = movieSystem.getMoviesByGenre("Action");
    actionMovies.forEach(movie => {
        console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
    });
    console.log("\n---------- Highest-Rated Movie ----------");
    const highestRatedMovie = movieSystem.getHighestRatedMovie();
    console.log(`Title: ${highestRatedMovie.title}, Genre: ${highestRatedMovie.genre}, Rating: ${highestRatedMovie.rating}, Year: ${highestRatedMovie.year}`);
    console.log("\n---------- Movies by Decade ----------");
    const moviesByDecade = movieSystem.groupMoviesByDecade();
    Object.keys(moviesByDecade).forEach(decade => {
        console.log(`Decade: ${decade}s`);
        moviesByDecade[decade].forEach(movie => {
            console.log(`Title: ${movie.title}, Genre: ${movie.genre}, Rating: ${movie.rating}, Year: ${movie.year}`);
        });
    });
    await movieSystem.fetchAdditionalMovies();
    console.log("\n---------- Updated Movie List ----------");
    movieSystem.printMovies();
}
main();