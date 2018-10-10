$(document).ready(function() {
  $("#successful").hide();
  $("#actorDump").hide();
  $("#reset").hide();
  $("#rotate").hide();
  $("#posters").hide();
  
});

function reset() {
  $("#successful").hide();
  $("#actorDump").empty();
  $("#picDump").empty();
  $("#reset").hide();
  $("#fileButton").show();
  $("#uploader").show();
  $("#add-image").show();
  $("#Also").hide();
  $("#posters").hide();
  
  $("#movie1").empty();
  $("#movie2").empty();
  $("#movie3").empty();
  results();
}

function hideStuff() {
  $("#successful").hide();
  $("#actorDump").hide();
  $("#reset").hide();
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
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton");

// Call the results function
results()
// on click, hide the placeholder image,
function results() {
$("input[type='image']").click(function() {
  $("input[id='fileButton']").click();
  $("#add-image").hide();
  $("#rotate").show();
 

// display rotate gif,
//set timeout for a few seconds,
//then run firebase function

//listen for file selection
var uploadBar = fileButton.addEventListener("change", function(event) {
  $("#add-image").hide();
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
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
    },

    function error(err) {},
    //when the file is uploaded and the progress bar gets to 100% --
    function complete() {
      //get a snapshot of the download URL
      task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        //log it
        console.log("File available at", downloadURL);
        //initialize the API
        const app = new Clarifai.App({
          apiKey: "724ce3bc62704899808fc73f196edc8a"
        });
        app.models
          .predict("e466caa0619f444ab97497640cefc4dc", downloadURL)
          .then(
            function(response) {
              console.log(response);

              // Creating and storing a div tag
              var celebDiv = $("<div>");

              // Creating and storing an image tag
              var celebImg = $("<img class='celebPic'>");
              var celebText = $("<p class='celebtext'>").text(
                "We are " +
                  (
                    response.outputs[0].data.regions[0].data.face.identity
                      .concepts[0].value * 100
                  ).toFixed(1) +
                  "% sure it's " +
                  response.outputs[0].data.regions[0].data.face.identity
                    .concepts[0].name
              );

              //push the name to the DB
              database.ref().push({
                name:
                  response.outputs[0].data.regions[0].data.face.identity
                    .concepts[0].name
              });
              // Creating a variable for the actor's name so it can be used to plug into the movie api
              var name =  response.outputs[0].data.regions[0].data.face.identity
              .concepts[0].name
              console.log(name);

          // Add actor name into actor search here:
var actor = name;
var queryURL = "https://api.themoviedb.org/3/search/person?api_key=ce8d1bbc9cd5bd4134a54d0e77251a02&query=" + actor + "&language=en-US&page=1&include_adult=false"


$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    console.log(response.results[0].profile_path)
/

              // Setting the src attribute of the image to a property pulled off the result item
              celebImg.attr("src", downloadURL);

              // Appending the paragraph and image tag to the div
              celebDiv.append(celebText);
              celebDiv.prepend(celebImg);
            
            
              $("#successful").hide();
              $("#reset").show();
              $("#rotate").hide();
              
              $("#posters").show();
              $("#movie1").show();
              $("#movie2").show();
              $("#movie3").show();
              // Prependng the div to the HTML page in the
              $("#picDump").prepend(celebDiv);
              $("#celebButton").append(celebDiv);
              
              // returns profile photo
    // $("#actor").append($("<img>").attr("src", "http://image.tmdb.org/t/p/w154/" + response.results[0].profile_path))
    // returns 3 posters
    $("#Also").prepend("Also seen in: <br>");
    var poster1 = $("#movie1").append($("<img 'class=post1'>").attr("src", "http://image.tmdb.org/t/p/w92/" + response.results[0].known_for[0].poster_path))
    var poster2 = $("#movie2").append($("<img 'class=post2'>").attr("src", "http://image.tmdb.org/t/p/w92/" + response.results[0].known_for[1].poster_path))
    var poster3 = $("#movie3").append($("<img 'class=post3'>").attr("src", "http://image.tmdb.org/t/p/w92/" + response.results[0].known_for[2].poster_path))
   
    var title = $("<p 'class=title'>").text(response.results[0].known_for[0].original_title);
    var title2 = $("<p 'class=title'>").text(response.results[0].known_for[1].original_title);
    var title3 = $("<p 'class=title'>").text(response.results[0].known_for[2].original_title);
    console.log(title);
    console.log(title2);
    console.log(title3); 
    
    $("#movie1").append(title);
    $("#movie2").append(title2);
    $("#movie3").append(title3);

    //overview
    var overview1 = $("<p 'class=title'>").text("Overview: " + response.results[0].known_for[0].overview);
    var overview2 = $("<p 'class=title'>").text("Overview: " + response.results[0].known_for[1].overview);
    var overview3 = $("<p 'class=title'>").text("Overview: " + response.results[0].known_for[2].overview);
    console.log(overview1);
    console.log(overview2);
    console.log(overview3);

    $("#movie1").append(overview1);
    $("#movie2").append(overview2);
    $("#movie3").append(overview3);

    //Popularity
    var popularity1 = $("<p 'class=title'>").text("Popularity: " + response.results[0].known_for[0].popularity);
    var popularity2 = $("<p 'class=title'>").text("Popularity: " +response.results[0].known_for[1].popularity);
    var popularity3 = $("<p 'class=title'>").text("Popularity: " +response.results[0].known_for[2].popularity);
    console.log(popularity1);
    console.log(popularity2);
    console.log(popularity3);

    $("#movie1").append(popularity1);
    $("#movie2").append(popularity2);
    $("#movie3").append(popularity3);
    
    //Release Date
    var release_date1 = $("<p 'class=title'>").text("Release Date: " + response.results[0].known_for[0].release_date);
    var release_date2= $("<p 'class=title'>").text("Release Date: " + response.results[0].known_for[1].release_date);
    var release_date3 = $("<p 'class=title'>").text("Release Date: " + response.results[0].known_for[2].release_date);
    console.log(release_date1);
    console.log(release_date2);
    console.log(release_date3);

    $("#movie1").append(release_date1);
    $("#movie2").append(release_date2);
    $("#movie3").append(release_date3);
    
   
            },
            function(err) {
              // there was an error
            }
          );
      });
    }
  );

  if ((percentage = 100)) {
    $("#uploader").hide();
    $("#fileButton").hide();
    $("#successful").show();
    uploader.value = 0;
  }
});
              
});
    
});
}
   


              
