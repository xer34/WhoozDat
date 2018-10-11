$(document).ready(function() {

    // Toggle for dropdown info
    $("#dropdownMenuButton").on("click", function (){
        $(this).children().slideToggle()
    });

    // Event listener for reset button
    $("body").on("click", "#reset", function(){
        reset()
    })
  
    // Resets page to upload screen
    function reset() {
        $("#celebDiv").empty()
        $("#addImage").show()
    }
  
  //--------------------------------------------------------------------//
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBGjGVTi6NmmYBLwWLfetJ7nYEg7wbBls0",
    authDomain: "celebdata-248e0.firebaseapp.com",
    databaseURL: "https://celebdata-248e0.firebaseio.com",
    projectId: "celebdata-248e0",
    storageBucket: "celebdata-248e0.appspot.com",
    messagingSenderId: "371108570955"
  };
  
  firebase.initializeApp(config);
  //--------------------------------------------------------------------//
  const database = firebase.database();
  
  //get elements
  var progressBar = document.getElementById("progressBar");
  var fileButton = document.getElementById("fileButton");

  //listen for file selection, this triggers whole chain of searches and page modification
  fileButton.addEventListener("change", function(event) {

    $("#addImage").hide();
    $("#progressBar").show();

    //get file
    var file = event.target.files[0];
    //create storage ref
    var storageRef = firebase.storage().ref("celebImages/" + file.name);
    // upload file
    var task = storageRef.put(file);
    // upload progress bar
  
    task.on(
      "state_changed",
      // upload bar progress
      function progress(snapshot) {
        // var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // progressBar.value = percentage;
      },
  
      function error(err) {},
      //when the file is uploaded and the progress bar gets to 100% --
      function complete() {
        //get a snapshot of the download URL
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          //log it
        //   console.log("File available at", downloadURL);
          //initialize the API
          const app = new Clarifai.App({
            apiKey: "724ce3bc62704899808fc73f196edc8a"
          });
          app.models
            .predict("e466caa0619f444ab97497640cefc4dc", downloadURL)
            .then(
              function(response) {
                // console.log(response);
  
            //    API Match Confidence Percent
                var percentConfidence = (
                      response.outputs[0].data.regions[0].data.face.identity
                        .concepts[0].value * 100
                    ).toFixed(1) 
  
                //push the name to the DB
                database.ref().push({
                  name:
                    response.outputs[0].data.regions[0].data.face.identity
                      .concepts[0].name
                });
                // Creating a variable for the actor's name so it can be used to plug into the movie api
                var name =  response.outputs[0].data.regions[0].data.face.identity
                .concepts[0].name
                // console.log(name);

            
            // Add actor name into actor search here:
  var actor = encodeURIComponent(name);
  var queryURL = "https://api.themoviedb.org/3/search/person?api_key=ce8d1bbc9cd5bd4134a54d0e77251a02&query=" + actor + "&language=en-US&page=1&include_adult=false"
  
//   Makes TMDB API call looking for actor info
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // console.log(response);

        var actorID = response.results[0].id
        // Populates the #celebDiv
        var celebCard = $("<div id=#celebCard>")
        celebCard.append($("<img class='celebPic'>").attr("src", downloadURL));
        celebCard.append($("<h3>").text("We are " + percentConfidence + "% sure it's " + response.results[0].name))
        $("#celebDiv").append(celebCard)
        $("#celebDiv").append($("<p>").text("Also seen in: "))
        $("#celebDiv").append($("<div id='movies'>"))
        $("#celebDiv").append($("<button id='reset'>Try Another</button>"))

        // Goes through each 'known_for' movie and makes a card
        for (let i = 0; i < response.results[0].known_for.length; i++) {
            var movie = $("<div class='movie'>")
            movie.append($("<img class='poster'>").attr("src", "http://image.tmdb.org/t/p/w185/" + response.results[0].known_for[i].poster_path))
            movie.append($("<h3>").text(response.results[0].known_for[i].original_title))
            movie.append($("<p>").attr("id", "character" + i))
                // Makes another API call to look up what character they played in each movie
            function getCharacter(i){
                var characterURL = "https://api.themoviedb.org/3/movie/" + response.results[0].known_for[i].id + "/credits?api_key=ce8d1bbc9cd5bd4134a54d0e77251a02"
                $.ajax({
                    url: characterURL,
                    method: "GET"
                }).then(function(otherResponse) {
                    // console.log(otherResponse)
                    for (let j = 0; j < otherResponse.cast.length; j++) {
                        if (otherResponse.cast[j].id === actorID) {
                            $("#character" + i).text("Character: " + otherResponse.cast[j].character) 
                        }
                    }
                })
            }
            getCharacter(i)

            $("#movies").append(movie)
        }
              
                $("#successful").hide();
                $("#celebDiv").show()
      
              },
              function(err) {
                // there was an error
              }
            );
        });
      }
    );
  
    if ((percentage = 100)) {
      $("#progressBar").hide();
      $("#fileButton").hide();
      $("#successful").show();
    //   progressBar.value = 0;
    }
  });
                
  });
      
});

     
  
  
                
  