export class ImportApi {

    async getGenreMovieList(id) {

        return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-BR&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${id}`).then(i => i.json());
    };

    async getListGenres() {

        return fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-BR').then(text => text.json()).then(item => item.genres);
    };

    async getMovieById(id) {

        return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-BR`).then(text => text.json());
    };

    async getHighlights() {

        return fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-BR').then(text => text.json());
    };

    async getUrlMoviesInTheaters() {
        return fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-br&page=1').then(text => text.json());
    };

    async getUrlMovieSearchInput() {
        const input = document.querySelector('#fav-input');
        return fetch(`https://api.themoviedb.org/3/search/movie?api_key=11b1b70485f623754e8bd5748e1e7e9d&language=pt-BR&query=${input.value}&page=1&include_adult=false`).then((text) => text.json()).then(list => list.results);
    };
};
