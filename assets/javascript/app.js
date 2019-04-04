
var emotions = [];
var favorites = [];
$(document).ready(function () {

    emotions = getFromLocalStorage("EmotionsList", ["eye roll", "confused", "what?", "yes!", "bored", "happy"]);

    favorites = getFromLocalStorage("FavoritesList", []);

    if (favorites.length > 0) {
             
        getFavGifs("", true);
    }

    for (var i = 0; i < emotions.length; i++) {
        createButton(emotions[i], i);
    }
});

function getFromLocalStorage(name, defaultValue) {
    var localStorageValue = localStorage.getItem(name);

    if (localStorageValue != null) {
        return JSON.parse(localStorageValue);
    } else {
        return defaultValue;
    }
}

function saveToLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function addButton() {
    event.preventDefault();

    var newEmotion = $('#wordSearchInput').val();

    if (emotions.indexOf(newEmotion.toLowerCase()) == -1) {
        emotions.push(newEmotion.toLowerCase());
        createButton(newEmotion, emotions.length - 1);
        saveToLocalStorage("EmotionsList", emotions);
    }

    $("#wordSearchInput").val("");

}

function createButton(emotion, emotionIdx) {
    var optionBtn = new $('<button>', {
        class: "btn btn-light emotionBtn",
        id: emotionIdx,
        'data-name': emotion,
        text: emotion,
        click: function () {
            getGifs(emotion);
        },
        mouseenter: function () {
            $(this).find("i").css('display', 'block');
        },
        mouseleave: function () {
            $(this).find("i").css('display', 'none');
        }
    });

    var closeBtn = new $('<i>', {
        class: "fas fa-times closeBtn",
        id: "emotion-" + emotionIdx,
        click: function () {
            //var remove = confirm("Do you want to remove " + emotion + " button?");
            // if (remove) {
            $("#" + emotionIdx).remove();
            $(this).remove();
            emotions.splice(emotions.indexOf(emotion), 1);
            saveToLocalStorage("EmotionsList", emotions);
            // }
        },
    });

    optionBtn.append(closeBtn);
    $('#buttons-view').append(optionBtn);
}

function getGifs(emotion) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=ybqzc5bNzyznWiHYl6Q3eCwoFWOxmUBQ&q=" + emotion + "&limit=10&offset=0&rating=G&lang=en";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        showGifs(emotion, response);
    });
}

function getFavGifs( imgId) {

    let queryURL = "";
    if (imgId) {
        //create gif for id passed
        queryURL = "https://api.giphy.com/v1/gifs/" + imgId + "?api_key=ybqzc5bNzyznWiHYl6Q3eCwoFWOxmUBQ";

    } else {
        //create gifs from local storage
        queryURL = "https://api.giphy.com/v1/gifs?api_key=ybqzc5bNzyznWiHYl6Q3eCwoFWOxmUBQ&ids=";
        for (var i = 0; i < favorites.length; i++) {
            if (i > 0) {
                queryURL += ",";
            }
            queryURL += favorites[i];
        }
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        if (imgId) {
            createFavGifs(response.data);
        } else {
            for (var i = 0; i < response.data.length; i++) {
                createFavGifs(response.data[i]);
            }
        }

    });
}

function createFavGifs(data) {

    var imgSrc = data.images.preview_gif.url;

    var gifCard = new $('<div>', {
        class: "card",
        id: "fav-" + data.id
    });

    var gifImg = new $('<img>', {
        class: "card-img favGif",
        src: imgSrc,
    });
    gifCard.append(gifImg);
    $('#favorites-container').append(gifCard);
}


function showGifs(emotion, response) {
    $('#gif-container').empty();
    for (var i = 0; i < response.data.length; i++) {
        var imgSrc = response.data[i].images.original_still.url;
        let imgId = response.data[i].id;

        var gifCard = new $('<div>', {
            class: "card"
        });

        var gifImg = new $('<img>', {
            class: "card-img gif",
            alt: emotion + " image",
            src: imgSrc,
            id: imgId,
            "data-still": imgSrc,
            "data-active": response.data[i].images.original.url,
            "data-state": "still",
            click: function () {
                var state = $(this).data("state");
                if (state == "still") {
                    $(this).attr('src', $(this).data("active"));
                    $(this).data('state', 'animate');
                } else if (state == "animate") {
                    $(this).attr('src', $(this).data("still"));
                    $(this).data('state', 'still');
                }
            }
        });

        var isfavorite = (favorites.indexOf(imgId) >= 0);

        var favoriteIcon = new $('<i>', {
            class: isfavorite ? "fas fa-heart favIcon" : "far fa-heart favIcon",
            "data-favorite": isfavorite,
            click: function () {
                var favorite = $(this).data("favorite");
                if (favorite) {
                    $(this).attr("class", "far fa-heart favIcon");
                    isfavorite = false;
                    favorites.splice(favorites.indexOf(imgId), 1);
                    removeFromFavorites(imgId);
                } else {
                    $(this).attr("class", "fas fa-heart favIcon");
                    isfavorite = true;
                    if (favorites.indexOf(imgId) == -1) {
                        favorites.push(imgId);
                        getFavGifs(imgId);
                    }
                }
                $(this).data('favorite', isfavorite)
                saveToLocalStorage("FavoritesList", favorites);
            }
        });

        gifCard.append(favoriteIcon);
        gifCard.append(gifImg);
        $('#gif-container').append(gifCard);
    }
}

function removeFromFavorites(imgId) {
    var id = "#fav-" + imgId;
    $(id).remove();

}

