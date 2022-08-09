const $contenedorPeliculas = document.getElementById("contenedor-peliculas"),
// $contenedorPeliculasRecom = document.getElementById("contenedor-peliculas-recom"),
$similarMovies = document.getElementById("similar-movies"),
$contenedorPeliculasRecom =  document.createElement("div"),
$contPrincipal = document.getElementById("cont-principal"),
$body = document.body
let busqueda = "",
pagina = 1,
busquedaUrl = ""

// console.log(coords)

const emptyContainer = ()=>{

  if(document.querySelector("#contenedor-peliculas").childElementCount === 0){
    
    let error = `<div id="contenedor-error"> 
    <img id="imgerror" src="./images/imgerror.jpg">
    </div>`
    
    $contenedorPeliculas.innerHTML = error
  }
}

async function getData(){

  let cont = 0

  try {

    let res = await axios.get("https://api.themoviedb.org/3/movie/popular?api_key=8bbf52595246dbe63fef3ba5b8e4e282&page=${pagina}"),
    json = res.data.results,
    peliculas = "";
    
    json.forEach(element => {
      cont++
      if(cont < 19){
        let img = element.poster_path || element.backdrop_path;
        // console.log(element)
        peliculas +=`
        <div id="peliculas">
        <figure>
        <img id="poster"src="https://image.tmdb.org/t/p/w400${img}">
        <figcaption id="caption">${element.original_title}</figcaption>
        </figure>
        </div>`
        
      }

    });

    $contenedorPeliculas.innerHTML = peliculas
  } catch (error) {
    let message = error.response.statusText || "Ocurrio un error"
    $contenedorPeliculas.innerHTML = `Error ${error.response.status}: ${message}` 

  }
}  


async function getSpecificData(){

  try {
    
    let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=8bbf52595246dbe63fef3ba5b8e4e282&language=en-US&query=${busqueda}&page=1`),
    json = res.data.results,
    peliculas = ``;

    json.forEach(element =>{
      let img = element.poster_path || element.backdrop_path;
      let url = `https://image.tmdb.org/t/p/w400${img}`
      if(!element.poster_path && !element.backdrop_path){
        url = "./images/image.png"
      }
      peliculas +=`
      <div id="peliculas">
        <figure>
        <img id="poster"src="${url}">
        <figcaption id="caption">${element.original_title}</figcaption>
        </figure>
      </div>`

    })

    $contenedorPeliculas.innerHTML = peliculas
    $contenedorPeliculasRecom.innerHTML = ""
    $similarMovies.innerHTML = ""
    $contenedorPeliculasRecom.classList.remove("contenedor-peliculas-recom")
    

  } catch (error) {

    let message = error.response.statusText || "Ocurrio un error"
    $contenedorPeliculas.innerHTML = `Error ${error.response.status}: ${message}` 

  }
  emptyContainer()
}


async function getSimilar(movie_id){

  let res = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=8bbf52595246dbe63fef3ba5b8e4e282&language=en-US&page=1`),
  json = res.data.results,
  peliculas = ""

  json.forEach(element =>{

    let img = element.poster_path || element.backdrop_path;
    let url = `https://image.tmdb.org/t/p/w400${img}`
    if(!element.poster_path && !element.backdrop_path){
      url = "./images/image.png"
    }

    peliculas +=`
    <div id="peliculas-recom">
      <figure>
      <img id="poster"src="${url}">
      <figcaption id="caption">${element.original_title}</figcaption>
      </figure>
    </div>`

  })
  $contenedorPeliculasRecom.innerHTML = peliculas
  $contenedorPeliculasRecom.classList.add("contenedor-peliculas-recom")

  $contPrincipal.insertAdjacentElement("beforeend", $contenedorPeliculasRecom)

  // console.log(json)

}

let coords;
  
let cont = 0

function getDescription(){

  document.addEventListener("click", async (e)=>{
    
    try {

      if(e.target.matches("#caption") || e.target.matches("#poster")){
        // console.log(e.target.textContent)

        let prob = document.querySelectorAll("#poster")

        prob.forEach(element => {
          // console.log(element.nextElementSibling.innerHTML)
          // console.log(element.src)
          if(e.target.src === element.src || e.target.textContent === element.nextElementSibling.innerHTML){
            busqueda = element.nextElementSibling.innerHTML
            busquedaUrl = element.src.slice(31)
            // console.log(busquedaUrl)
          }
        });

        // busqueda = document.getElementById("caption")
        // console.log(busqueda)
      }
      else{
        return;
      }
      
      let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=8bbf52595246dbe63fef3ba5b8e4e282&language=en-US&query=${busqueda}&page=1`),
      json = res.data.results,
      peliculas = ``;
  
      json.forEach((element)=>{
        // console.log(element)

        let img = element.poster_path || element.backdrop_path;
        let url = `https://image.tmdb.org/t/p/w400${img}`
        if(!element.poster_path && !element.backdrop_path){
          url = "./images/image.png"
        }
        // console.log(img)
  
        if(element.original_title === busqueda && busquedaUrl === img){
          coords = $body.getBoundingClientRect();
          // console.log(coords.width)

          if(coords.width > 860){

            peliculas +=`


            <div id="contenedor-descripcion">
              <div id="description">
              <h3>${element.original_title}</h3>
              <p class="info-desc">Language: ${element.original_language.toUpperCase()}</p>
              <p class="info-desc">Rating: ${element.vote_average} ⭐</p>
              <p class="info-desc">Release date: ${element.release_date}</p>
              <p class="desc">${element.overview}</p>
              </div>
              
              <div id="contenedor-img">
              <img id="img" src="${url}">
              </div>
            </div>

            `
            $similarMovies.innerHTML = `Because you search ${element.original_title}`
            getSimilar(element.id) 


          }
          else{

            peliculas +=`
            <div id="description">
            <h3>${element.original_title}</h3>
            <p class="info-desc">Language: ${element.original_language.toUpperCase()}</p>
            <p class="info-desc">Rating: ${element.vote_average} ⭐</p>
            <p class="info-desc">Release date: ${element.release_date}</p>
            <p class="desc">${element.overview}</p>
            </div>`
            $similarMovies.innerHTML = `Because you search ${element.original_title}`
            getSimilar(element.id) 
          }
        
        }
      })

      $contenedorPeliculas.innerHTML = peliculas


    } catch (error) {
      let message = error.response.statusText || "Ocurrio un error"
      $contenedorPeliculas.innerHTML = `Error ${error.response.status}: ${message}` 
    }

  })
    
}

document.addEventListener("DOMContentLoaded", (e)=>{
  
  getDescription()

  document.addEventListener("keyup",(e)=>{

    busqueda = document.getElementById("input-search").value

    if(e.target.matches("#input-search")&& busqueda.length > 0){
      busqueda = document.getElementById("input-search").value
      getSpecificData()
    }
    
  })

  document.addEventListener("click", (e)=>{
    if(e.target.matches("#input-btn") && busqueda.length > 0 ){
      getSpecificData()
    }
  })

  getData();
})
