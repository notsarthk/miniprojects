const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=40.730610&longitude=-73.935242&lang=EN');
xhr.setRequestHeader('x-rapidapi-key', '8f8ebaa121msh936a9127eca2372p12daf7jsna6eaa5211dc6');
xhr.setRequestHeader('x-rapidapi-host', 'open-weather13.p.rapidapi.com');

xhr.send(data);


//Main code goes from here 
const apiKey = '8f8ebaa121msh936a9127eca2372p12daf7jsna6eaa5211dc6';
const apiHost = 'open-weather13.p.rapidapi.com';
const apiUrl = `https://${apiHost}/fivedaysforcast?latitude=40.730610&longitude=-73.935242&lang=EN`;