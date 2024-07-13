document.querySelector('body').onload = async () => {

	const token = localStorage.getItem('jwt-token')

	const res = await fetch(`http://localhost:8080/listado`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
		})
	if(!res.ok){
		window.location.href="/login.html"
		throw Error("Problemas en login")
	}
	const datos = await res.json()
	let listaHTML = document.querySelector(`#listado`)
	listaHTML.innerHTML = ''
	datos.forEach(registro => {
		listaHTML.innerHTML += `
		<form method="POST" action="/listado?_metodo=DELETE" style="display:flex">
			<h4>${registro.codcurso}</h4>
			<h4>${registro.precio}</h4>
			<h4>${registro.cantidadhoras}</h4>
			<input type="hidden" name="idEliminar" value="${registro.nromov}">
			<h4><button><a href="/modificar/${registro.nromov}">Modificar</a></h4>
			<h4><input type="submit" value="Eliminar"></h4>
		</form>`
	})
}