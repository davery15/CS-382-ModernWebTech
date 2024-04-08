function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update the queryMovies function
function queryMovies() {
    const genre = document.getElementById('genreQuery').value;
    if (genre) {
        fetch(`/query?genre=${genre}`)
            .then(response => response.json())
            .then(data => {
                // Display the query result on the page
                const moviesContainer = document.getElementById('moviesContainer');
                moviesContainer.innerHTML = ''; // Clear previous movies

                if (data.movies && data.movies.length > 0) {
                    data.movies.forEach(movie => {
                        const movieElement = document.createElement('div');
                        movieElement.innerHTML = `<strong>Title:</strong> ${movie.title}, <strong>Director:</strong> ${movie.director}, <strong>Genre:</strong> ${movie.genre}, <strong>Rating:</strong> ${movie.rating}, <strong>Release Date:</strong> ${formatDate(movie.releaseDate)}`;
                        moviesContainer.appendChild(movieElement);
                    });
                } else {
                    const noMoviesElement = document.createElement('p');
                    noMoviesElement.textContent = 'No movies found.';
                    moviesContainer.appendChild(noMoviesElement);
                }
            })
            .catch(error => console.error('Error querying movies:', error));
    } else {
        console.log('Please select a genre.');
    }
}

// Update the validateForm function
function validateForm() {
    // Get form input values
    const title = document.getElementById('title').value.trim();
    const director = document.getElementById('director').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const releaseDate = document.getElementById('releaseDate').value.trim();

    // Check if any field is empty
    if (title === '' || director === '' || genre === '' || rating === '' || releaseDate === '') {
        alert('Please fill out all fields.');
        return false; // Prevent form submission
    }
    // If all fields are filled out, submit the form and display the result
    fetch('/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, director, genre, rating, releaseDate })
    })
    .then(response => response.json())
    .then(data => {
        // Display the created movie details on the page
        const createdMovie = data.movie;
        const moviesContainer = document.getElementById('moviesContainer');
        const movieElement = document.createElement('div');
        movieElement.innerHTML = `<strong>Title:</strong> ${createdMovie.title}, <strong>Director:</strong> ${createdMovie.director}, <strong>Genre:</strong> ${createdMovie.genre}, <strong>Rating:</strong> ${createdMovie.rating}, <strong>Release Date:</strong> ${formatDate(createdMovie.releaseDate)}`;
        moviesContainer.appendChild(movieElement);
    })
    .catch(error => console.error('Error creating movie:', error));

    return false; // Prevent default form submission
}
