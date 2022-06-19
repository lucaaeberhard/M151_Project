import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'vmadmin',
    password: 'sml12345',
    database: 'movie-db',
});

await connection.connect();

export async function getById(id, userId) {
    const query = 'SELECT * FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
    const [data] = await connection.query(query, [id, userId]);
    return data.pop();
}

export async function getAll(userId) {
    const query = 'SELECT id, title, year, user, public FROM Movies WHERE user = ? OR public = 1';
    const [data] = await connection.query(query, [userId]);
    let ratingsAverage = [];
    let ratings = [];
    let movies = data.map(movie => movie.id)
    let i = 0;
    for (const movie of movies) {
        const ratingsQuery = 'SELECT rating FROM Ratings WHERE movie = ? AND user = ?';
        const [movieRating] = await connection.query(ratingsQuery, [movie, userId]);
        const ratingAverageQuery = 'SELECT AVG(rating) as ratings FROM Ratings WHERE movie = ?';
        const [movieRatingAverage] = await connection.query(ratingAverageQuery, [movie]);
        ratings.push(movieRating);
        ratingsAverage.push(movieRatingAverage);
    }
    data.forEach(function(e) {
        e["rating"] = parseFloat(ratings[i].map(rating => rating.rating));
        e["ratings"] = parseFloat(ratingsAverage[i].map(ratings => ratings.ratings));
        i++
    });
    return data;
}

async function update(movie) {
    const query = 'UPDATE Movies SET title = ?, year = ?, user = ?, public = ? WHERE id = ?';
    await connection.query(query, [movie.title, movie.year, movie.user, movie.public, movie.id]);
    return movie;
}

async function insert(movie) {
    const moviesQuery = 'INSERT INTO Movies (title, year, user, public) VALUES (?, ?, ?, ?)';
    const [result] = await connection.query(moviesQuery, [movie.title, movie.year, movie.user, movie.public]);
    const ratingsQuery = 'INSERT INTO Ratings (movie, rating, user) VALUES (?, ?, ?)';
    await connection.query(ratingsQuery, [result.insertId, 0, movie.user]);
    return {...movie, id: result.insertId };
}

export async function remove(id) {
    const deleteQuery = 'DELETE FROM Movies WHERE id = ?';
    await connection.query(deleteQuery, [id]);
    const ratingsQuery = 'DELETE FROM Ratings WHERE movie = ?';
    await connection.query(ratingsQuery, [id]);
    return;
}

export async function rating(movie, rating, user) {
    const deleteQuery = 'DELETE FROM Ratings WHERE movie = ? AND user = ?';
    await connection.query(deleteQuery, [movie, user]);
    const ratingsQuery = 'INSERT INTO Ratings (movie, rating, user) VALUES (?, ?, ?)';
    await connection.query(ratingsQuery, [movie, rating, user]);
    return;
}

export function save(movie) {
    if (!movie.id) {
        return insert(movie);
    } else {
        return update(movie);
    }
}