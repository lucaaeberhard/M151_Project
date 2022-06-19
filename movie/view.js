export function render(movies) {
    let star1, star2, star3, star4, star5
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Movie Liste</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="col-12">
<a href="/logout">abmelden</a>
  <table>
    <thead><tr><th>Id</th><th>Title</th><th>Rating</th><th>AVG</th><th></th><th></th></tr></thead>
    <tbody>
      ${movies
        .map(
          (movie) => `
        <tr>
          <td>${movie.id}</td>
          <td>${movie.title}</td>
          <td>
            <form id="rating" action="/movie/rating/${movie.id}">
              <div class="star-rating star-5">
                <input type="radio" name="star" value="1" id="star1" onchange='this.form.submit();' ${star1 = movie.rating == 1 ? "checked" : ""}>
                <i></i>
                <input type="radio" name="star" value="2" id="star2" onchange='this.form.submit();' ${star2 = movie.rating == 2 ? "checked" : ""}>
                <i></i>
                <input type="radio" name="star" value="3" id="star3" onchange='this.form.submit();' ${star3 = movie.rating == 3 ? "checked" : ""}>
                <i></i>
                <input type="radio" name="star" value="4" id="star4" onchange='this.form.submit();' ${star4 = movie.rating == 4 ? "checked" : ""}>
                <i></i>
                <input type="radio" name="star" value="5" id="star5" onchange='this.form.submit();' ${star5 = movie.rating == 5 ? "checked" : ""}>
                <i></i>
              </div>
            </form>
          </td>
          <td>${movie.ratings}</td>
          <td><a href="/movie/delete/${movie.id}">löschen</a></td>
          <td><a href="/movie/form/${movie.id}">bearbeiten</a></td> 
        </tr>`,
        )
        .join('')}
    </tbody>
  </table>
  <a href="/movie/form">neu</a>
</body>
</html>
  `;
}