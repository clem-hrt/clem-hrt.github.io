const username = "clem-hrt";



fetch(`https://api.github.com/users/${username}/repos`)

.then(response => response.json())

.then(repos => {



const container =

document.getElementById("github-projects");



container.innerHTML = "";



repos

.sort(

(a,b)=>

new Date(b.updated_at)

-

new Date(a.updated_at)

)

.slice(0,6)

.forEach(repo => {



container.innerHTML += `

<div class="repo">



<h3>${repo.name}</h3>



<p>

${repo.description || "No description"}

</p>



<p>

Language: ${repo.language || "N/A"}

</p>



<a href="${repo.html_url}" target="_blank">

View Repository

</a>



</div>

`;



});



})

.catch(() => {



document.getElementById(

"github-projects"

).innerHTML =

"Unable to load repositories.";



});
