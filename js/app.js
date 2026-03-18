let lang='es';

function setLang(l){lang=l; load();}

async function load(){
 const res = await fetch('content/videos.json');
 const data = await res.json();
 const v = data.videos[0];

 const t = v.translations[lang] || v.translations['es'];

 document.getElementById('featured').innerHTML =
  `<iframe src="https://www.youtube.com/embed/${v.youtubeId}" frameborder="0"></iframe>`;

 document.getElementById('recipe').innerHTML =
  `<h2>${t.title}</h2>
   <p>${t.description}</p>
   <h3>Ingredients</h3>
   <ul>${t.ingredients.map(i=>'<li>'+i+'</li>').join('')}</ul>
   <h3>Steps</h3>
   <ol>${t.steps.map(s=>'<li>'+s+'</li>').join('')}</ol>`;
}

load();
