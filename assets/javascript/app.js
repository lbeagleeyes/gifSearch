
var emotions = ["eye roll", "confused", "what?", "yes!", "bored", "happy"];
$(document).ready(function () {

    for (var i = 0; i < emotions.length; i++) {
        createButton(emotions[i]);
    }

});



function addButton() {
    event.preventDefault();

    var newEmotion = $('#wordSearchInput').val();

    if (emotions.indexOf(newEmotion.toLowerCase()) == -1) {
        emotions.push(newEmotion.toLowerCase());
        createButton(newEmotion);
    }

    $("#wordSearchInput").val("");

}

function createButton(emotion) {
    var optionBtn = new $('<button>', {
        class: "btn btn-light emotionBtn",
        id: "#" + emotion,
        'data-name': emotion,
        text: emotion,
        click: function () {
            getGifs(emotion);
        }
    });

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

function showGifs(emotion, response) {
    $('#gif-container').empty();
    for (var i = 0; i < 10; i++) {
        var gifSrc = response.data[i].images.original.url;
        var imgSrc = response.data[i].images.original_still.url;

        var gifCard = new $('<div>', {
            class: "card"
        });

        var gifImg = new $('<img>', {
            class: "card-img gif",
            alt: emotion + " image",
            src: imgSrc,
            "data-still": imgSrc,
            "data-active": gifSrc,
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
        gifCard.append(gifImg);
        $('#gif-container').append(gifCard);
    }
}

