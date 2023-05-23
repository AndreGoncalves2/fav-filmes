import { ImportApi } from "./importmovie.js";

class Favorite {
    
    constructor() {
        this.onSearchInput();
        this.load();
        this.update();
    };

    update() {

        this.clearFavDates();
        this.createFavList();
    };

    load() {
        this.content = JSON.parse(localStorage.getItem('@filmes-fav:')) || [];
    };

    save() {
        localStorage.setItem('@filmes-fav:', JSON.stringify(this.content));
    };

    clearFavDates() {

        const allDatas = document.querySelectorAll('#fav-movie div .fav div');
        allDatas.forEach(div => div.remove());
    };
};

export class Structure extends Favorite {

    constructor() {

        super();
        this.importApi = new ImportApi();
        this.SearchInput();
        this.createNewCatalog();
        this.onOpenButton();
        this.onCloseMenuButton();
        this.onDeskSearchButton();
        this.highlightCarousel();
        this.checkIsEmpty('remove');
    };

// ***************** Fovorites *********************\\

    checkIsEmpty(intention) {
        const favorites = document.querySelectorAll('#fav-movie .fav div');
            this.favoitesWrapper = document.querySelector('#fav-movie');

        if(intention == 'remove'){
            
            if(favorites.length == 0) {
                this.favoitesWrapper.style.display = 'none';
            };
        };

        if(intention == 'add') {
            this.favoitesWrapper.style.display = 'block';
        };
    };

    createFavList() {

        const sectionFav = document.querySelector('#fav-movie');
        const favMovie = sectionFav.querySelector('.fav');

        this.content.forEach(({ poster_path, title, genres, overview, release_date, vote_average, runtime }) => {
            
            const newFilme = document.createElement('div');
            
            newFilme.innerHTML = 
            `
            <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="">
            `;
            favMovie.append(newFilme);

            newFilme.onclick = () => { 

                this.createNewModal(
                    poster_path,
                    title,
                    genres,
                    overview,
                    release_date,
                    vote_average,
                    runtime
                );
            };
        });

        sectionFav.querySelector('.button-left-outdoor').addEventListener('click', () => {
            this.moveMovieList('left', '#fav-movie');
        });

        sectionFav.querySelector('.button-right-outdoor').addEventListener('click', () => {
            this.moveMovieList('right', '#fav-movie');
        });
    };

// ***************** Search *********************\\

    onSearchInput() {
        this.input = document.querySelector('#fav-input');
        const movieWrapper= document.querySelector('div.movie-wrapper');
        
        this.input.addEventListener('input', () => {
            if(movieWrapper == undefined) return;
            movieWrapper.classList.remove('hidden');
        });

        this.input.addEventListener('focusout', () => {
            movieWrapper.classList.add('hidden');
        });
    };

    onDeskSearchButton() {

        const input = document.querySelector('#fav-input');
        const button = document.querySelector('#button-search');

        button.addEventListener('click', () => {
            input.classList.remove('input-hidden');
        });
    }

    SearchInput() {
 
        this.input.addEventListener('input', () => {

            clearTimeout(this.interval);
            this.interval = setTimeout(this.listener, 500);
        });
    };

    listener = () => {

        const list = this.importApi.getUrlMovieSearchInput();
        this.searchList(list);
    };

    async searchList(list) {

        this.clearItems();
        
        const listItems = await list;

        for(let i = 0; i < 5; i++) {

            if(listItems[i] != undefined ){

                const { id } = await listItems[i];
                
                this.importApi.getMovieById(id)
                .then((item) => {

                    if(item.poster_path == null) {
                        listItems.splice(i,1);
                        return
                    };

                    this.item = item;
                    this.createNewItem();
                });
            };
        };

        this.checkItemsSearch(listItems.length);
    };

    checkItemsSearch(length) {
        
        const unsuccessfullSearch = document.querySelector('.unsuccessful-search');

        if(length == 0) {
            unsuccessfullSearch.style.display = 'flex';
            return;
        };

        if(length != 0 &&  unsuccessfullSearch.style.display == 'flex') {
            unsuccessfullSearch.style.display = 'none';
        };
    };

    clearItems() {
    
        this.items = document.querySelectorAll('.search-movie button');
        this.items.forEach(item => item.remove());
    };

    createNewItem() {
    
        const {
            poster_path,
            title,
            genres,
            overview,
            release_date,
            vote_average,
            runtime 
        } = this.item;
    
        const newElement = document.createElement('button');
        
        this.elementWrapper = document.querySelector('.search-movie');
        
        newElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="">
        <div>
        <span class="name">${title}</span>
        </div>
        `
        this.elementWrapper.append(newElement);
        
        newElement.addEventListener('click', () => {
    
            this.createNewModal(
                poster_path,
                title, 
                genres,
                overview,
                release_date,
                vote_average,
                runtime
            );
        });
    };
    
// ***************** Modal *********************\\

    clearModal() {

        this.modal = document.querySelector('#modal-wrapper #modal');
        this.modalWrapper = document.querySelector('#modal-wrapper');

        this.modal.remove();
    };

    createNewModal(poster_path, title, genres, overview, release_date, vote_average, runtime) {

        release_date = release_date.substr(0, 4);

        this.load();
        this.names = '';

        this.formatGenres(genres);

        this.verifyFavorited(title);

        this.clearModal();

        const newModal = document.createElement('div');
        
        newModal.setAttribute('id', 'modal');

        newModal.innerHTML = `
        <div class="header">
            <img src="http://image.tmdb.org/t/p/w1280/${poster_path}" alt="Imagem do filme">
            
            <div class="infos">

                <div class="top">
                    <h1>${title}</h1>
                    <div>
                        <span class="vote">${Math.trunc(vote_average)*10 +"% relevante"}</span>
                        <span>${release_date}</span>
                        <span>${runtime} min</span>
                    </div>
                </div>

                <div class="footer">
                    <span class="genres">${this.names}</span>
                    <p>${overview}</p>
                </div>
            </div>
            
            <div class="buttons-wrapper">
                <button class="close-button">
                    <i class="fa-solid fa-arrow-left fa-2xl"></i>
                </button>

                <button class="remove-favorites">
                    <i class="fa-solid fa-heart fa-2xl"></i>
                </button>
                
                <button class="add-favorites">
                    <i class="fa-regular fa-heart fa-2xl">
                    </i>
                </button>
            </div>
        </div>
                
        `;

        this.modalWrapper.append(newModal);
        this.modalWrapper.classList.remove('hidden');
        
        this.newContent = {
            poster_path,
            title,
            genres,
            overview,
            release_date,
            vote_average,
            runtime
        };

        this.creatButtons(title);

        this.body = document.querySelector('body');
        this.body.style.overflow = 'hidden';

        this.addFavButton.style.display = `${this.visibilityAddButtonFav}`;
        this.removeFavButton.style.display = `${this.visibilityRemoveButtonFav}`;
    };

    formatGenres(genres) {
            
        for(let i = 0; i < 3; i++) {

            if(genres[i] != undefined) {
                this.names += '<span>'+ genres[i].name + '</span>';
            };
        };
    };

    verifyFavorited(title) {

        this.onFavorited = this.content.find(name => name.title == title);

        if(this.onFavorited) {
            
            this.visibilityAddButtonFav = `none`;
            this.visibilityRemoveButtonFav = `block`;
        } else {
            this.visibilityRemoveButtonFav = `none`;
            this.visibilityAddButtonFav = `block`;
        };
    };

    creatButtons(title) {

        const closeButton = document.querySelector('.close-button');
        this.addFavButton = document.querySelector('.add-favorites');
        this.removeFavButton = document.querySelector('.remove-favorites');

        closeButton.addEventListener('click', () => {

            this.modalWrapper.classList.add('hidden');
            this.input.focus();
            this.body.style.overflow = 'auto';
            
        });

        this.addFavButton.addEventListener('click', () => {
            
            this.checkIsEmpty('add');
            
            this.addFavButton.style.display = 'none';
            this.removeFavButton.style.display = 'block';

            this.content = [this.newContent, ...this.content]; 
            this.save();
            this.update();
            
        });
        
        this.removeFavButton.addEventListener('click', () => {

            this.addFavButton.style.display = 'block';
            this.removeFavButton.style.display = 'none'

            const newList = this.content.filter((element) => element.title != title );
            
            this.content = newList;
            this.save();
            this.update();

            this.checkIsEmpty('remove');

        });
    };

    favIsEmpty() {
        console.log(this.favoitesWrapper)   
    }

// ***************** Menu-Expanded *********************\\

    onOpenButton() {

        this.openMenuButtons = document.querySelector('#open-button');
        this.closeMenuButton = document.querySelector('#close-button');

        const menuWraper = document.querySelector('.menu-expanded-wrapper');
        const body = document.querySelector('body');

        window.addEventListener('resize', () => {
            
            if(body.clientWidth > 700) {
            menuWraper.classList.add('hidden');
            };
        });

        this.openMenuButtons.addEventListener('click', () => {
            this.openMenuButton();
        });
    };

    openMenuButton() {

        this.body = document.querySelector('body');
        this.menuWraper = document.querySelector('.menu-expanded-wrapper');
        this.menuExpanded = document.querySelector('.menu-expanded');
        
        this.menuExpanded.classList.remove('menu-expanded-hidden');
        this.menuWraper.classList.remove('hidden');
        this.openMenuButtons.classList.add('button-hidden');
        this.closeMenuButton.classList.remove('button-hidden');

        if(this.body.clientWidth > 700) {

            this.body.style.overflow = 'auto';
        } else {
            this.body.style.overflow = 'hidden'
            this.input.classList.remove('input-hidden');
        };
    };

    onCloseMenuButton() {

        this.closeMenuButton.addEventListener('click', () => {
            this.closeMenuButtonClick()
        });
    };

    closeMenuButtonClick() {
        
        const menuExpanded = document.querySelector('.menu-expanded');

        menuExpanded.classList.add('menu-expanded-hidden');
        this.closeMenuButton.classList.add('button-hidden');
        
        this.openMenuButtons.classList.remove('button-hidden');
        
        this.body.style.overflow = 'auto';

        this.input.classList.add('input-hidden');

        if(this.body.clientWidth > 700) {
            this.menuWraper.classList.add('hidden');
        };
    };

// ***************** Catalog *********************\\

    createNewCatalog() {

        this.createHighlights();
        this.createGenres();
        this.createInTheaters();
        this.getCurrentScroll(); 
    };
    
    getCurrentScroll() {

        const buttonScrollTop = document.querySelector('.scroll-top');

        window.addEventListener('scroll', () => {
            if(window.pageYOffset > 500) {
                buttonScrollTop.classList.remove('scroll-top-hidden');
            } else {
                buttonScrollTop.classList.add('scroll-top-hidden');
            };
        });
    };

    async createGenres() {

        const genres = await this.importApi.getListGenres();
        const sections = document.querySelector('.sections');
        const menu = document.querySelector('.list-genres');
        
        const list = document.createElement('ul');

        menu.append(list);
        
        genres.forEach(async ({ name, id }) => {

            const newName = name.replace(/\s/, '-');
            this.newMenuGenre = document.createElement('li');

            this.newMenuGenre.innerHTML = `<a href="#${newName}">${newName}</a>`
            list.append(this.newMenuGenre);

            this.defineScrollByGenre(newName);

            this.newGenre = document.createElement('div');
            
            this.newGenre.setAttribute("id", `${newName}`);
            this.newGenre.classList.add('genres')

            this.newGenre.innerHTML = `
            <h3>${newName}</h3>
            <div>
                <div>
                    <div class="movies">
                    </div>
                </div>

                <button class="button-left-outdoor">◀</button>
                <button class="button-right-outdoor">▶</button>
            </div>
            `;

            sections.append(this.newGenre);


            this.newGenre.querySelector('.button-left-outdoor').
            addEventListener('click', () => this.moveMovieList('left', `#${newName}`));

            this.newGenre.querySelector('.button-right-outdoor').
            addEventListener('click', ()=> this.moveMovieList('right', `#${newName}`));

            const movieList = this.importApi.getGenreMovieList(id);
            await movieList.then(((list) => this.createMovieListByGenre(list, newName)));
        });
    };

    async createMovieListByGenre(list, name) {
    
        list.results.forEach(({ id }) => {

            this.importApi.getMovieById(id)
            .then(({ poster_path, title, genres, overview, release_date, vote_average, runtime }) => {
                
                if(poster_path == null) return

                const div = document.querySelector(`#${name} .movies`);

                const newMovie = document.createElement('div');
                newMovie.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="">
                `
                div.append(newMovie);
                
                newMovie.addEventListener('click', () => {
                    this.createNewModal(poster_path, title, genres, overview, release_date, vote_average, runtime);
                });
            }); 
        });
    };

    async createHighlights() {

        this.importApi = new ImportApi();
        const highlights = await this.importApi.getHighlights();

        for(let i = 0; i <= 9; i++) {

            const { id } = highlights.results[i];
            
            this.importApi.getMovieById(id).then(({
                poster_path,
                vote_average,
                backdrop_path,
                release_date,
                runtime, genres,
                overview,
                title 
            }) => {
                
                const newHiglight = document.createElement('div');
                newHiglight.classList.add('current-item');
                const outdoor = document.querySelector('.outdoor-card');
                
                newHiglight.innerHTML = `
                <img src="http://image.tmdb.org/t/p/w1280${backdrop_path}" alt="">
                <h2>${title}</h2>
                `;
                
                outdoor.append(newHiglight);
                newHiglight.addEventListener('click', () => {
                    this.createNewModal(
                        poster_path,
                        title,
                        genres,
                        overview,
                        release_date,
                        vote_average,
                        runtime
                    );
                });
            });
        };
    };

    defineScrollByGenre(sectionName) {
        
        const menuExpanded = document.querySelector('.menu-expanded');

        this.newMenuGenre.addEventListener('click', (ev) => {
            ev.preventDefault();
            
            this.closeMenuButtonClick();

            var currentHeight = document.getElementById(`${sectionName}`).getBoundingClientRect();

            scrollTo(0, ((scrollY - 77) + currentHeight.y));
        });
    };

    createInTheaters() {
        this.importApi = new ImportApi();
        
        const theaters = document.querySelector('#theaters');
        const theatersFav = theaters.querySelector('.fav');

        const theatersItem = this.importApi.getUrlMoviesInTheaters()
        .then(item => item.results.forEach(({ id }) => this.importApi.getMovieById(id)
        .then(({
            poster_path,
            title, genres,
            overview,
            release_date,
            vote_average,
            runtime
        }) => {

            const newFilme = document.createElement('div');
                
                newFilme.innerHTML = 
                `
                <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="">
                `;
                theatersFav.append(newFilme);
    
                newFilme.onclick = () => { 
    
                    this.createNewModal(
                        poster_path,
                        title,
                        genres,
                        overview,
                        release_date,
                        vote_average,
                        runtime);
                };

                theaters.querySelector('.button-left-outdoor').addEventListener('click', () => {
                    this.moveMovieList('left', '#theaters');
                });
        
                theaters.querySelector('.button-right-outdoor').addEventListener('click', () => {
                    this.moveMovieList('right', '#theaters');
                });
        })));
    };

    moveMovieList(direction, genre) {

        this.section = document.querySelector(`${genre} div div`);
        const divGenresWidth = document.querySelector('.genres').clientWidth;
        
        if(direction == 'right') {
            this.section.scrollLeft += (divGenresWidth - 500);
        } else {
            this.section.scrollLeft += -(divGenresWidth - 500);
        };
    };

// ***************** Carousel *********************\\
    
    highlightCarousel() {
        const outdoorWrapper = document.querySelector('.outdoor');

        this.outdoorDiv = document.querySelector('.outdoor-card');

        const carouselButtonLeft = document.querySelector('.button-left-outdoor');
        const carouselButtonRight = document.querySelector('.button-right-outdoor');

        this.currentItens = 0;

        carouselButtonLeft.addEventListener('click', () => {
            if(this.currentItens > 0) {

                this.currentItens --; 
                this.scroll = this.currentItens * this.widthImg;
                this.muveToCarousel();
            };
        });

        carouselButtonRight.addEventListener('click', () => {
            this.ridingCarousel();
        });

        
        outdoorWrapper.addEventListener('mouseover', () => {
            clearTimeout(this.carouselInterval);
        });

        outdoorWrapper.addEventListener('mouseout', () => {
            this.carouselInterval = setInterval(this.ridingCarousel, 6000 );
        });
        
        this.carouselInterval = setInterval(this.ridingCarousel, 6000 );
    };

    muveToCarousel() {
        this.outdoorDiv.scrollLeft = this.scroll;
    };

    ridingCarousel = () => {

        const outdoor = document.querySelectorAll('.current-item');
        this.widthImg = outdoor[this.currentItens].clientWidth;

        if(this.currentItens <= 9) {

            this.currentItens ++; 
            this.scroll = this.currentItens * this.widthImg;
            this.muveToCarousel();
        };

        if(this.currentItens > 9) {

            this.currentItens = 0;
            this.scroll = 0;
            this.muveToCarousel();
        };
    };
};