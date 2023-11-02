import $ from 'jquery'

class Search {
    // Describe and initiate our object
    constructor(){
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term")
        this.events();
        this.isOverlayOpen = false;
        this.typingTimer
        this.resultsDiv = $("#search-overlay__results")
        this.isSpinnerVisible = false
        this.previousValue
    }

    //Events
    events(){
        this.openButton.on("click", this.openOverlay.bind(this))
        this.closeButton.on("click", this.closeOverlay.bind(this))
        $(document).on("keydown", this.keyPressDispatcher.bind(this))
        this.searchField.on("keyup", this.typingLogic.bind(this))
    }


    //Methods
    typingLogic(){
        if(this.searchField.val() != this.previousValue){
            clearTimeout(this.typingTimer)

            if(this.searchField.val()){
                if(!this.isSpinnerVisible){
                    this.resultsDiv.html('<div class="spinner-loader"></div>')
                    this.isSpinnerVisible = true;
                    }
                    this.typingTimer = setTimeout(this.getResults.bind(this), 2000)
            } else{
                this.resultsDiv.html('')
                this.isSpinnerVisible = false
            }
            
        }
        this.previousValue = this.searchField.val();
    }

    getResults(){
        $.getJSON('http://fictional-university.local/wp-json/wp/v2/posts?search=' + this.searchField.val(), (posts)=>{
            var testArray = ['red', 'orange', 'yellow']
            this.resultsDiv.html(`
                <h2 class="search-overlay__section-title">General Information</h2>
                ${posts.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search</p>'}
                    ${posts.map((item)=>{
                        return `<li><a href="${item.link}">${item.title.rendered}</a></li>`
                    }).join('')}
                ${posts.length ? '</ul>' : ''}
            `);
            this.isSpinnerVisible = false;
        })
    }

    openOverlay(){
        this.searchOverlay.addClass("search-overlay--active")
        $('body').addClass("body-no-scroll");
        this.isOverlayOpen = true
    }

    closeOverlay(){
        this.searchOverlay.removeClass("search-overlay--active")
        $('body').removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }

    keyPressDispatcher(e){
       if(e.keyCode === 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')){
        this.openOverlay()
       }
       if(e.keyCode === 27 && this.isOverlayOpen){
        this.closeOverlay();
       }
    }
}

export default Search;