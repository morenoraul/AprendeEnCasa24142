document.querySelector('body').onload = async () => {
	try {
		const token = localStorage.getItem('jwt-token');
		if (!token) {
			window.location.href = "/login.html";
			return;
		}

		const response = await fetch(`${window.location.origin}/listado`, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});

		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				window.location.href = "/login.html";
				return;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const datos = await response.json();
		let listaHTML = document.querySelector(`#listado`);
		listaHTML.innerHTML = '';
		datos.forEach(registro => {
			listaHTML.innerHTML += `
				<form method="POST" action="/listado?_metodo=DELETE" style="display:flex">
					<h4>${registro.codcurso}</h4>
					<h4>${registro.precio}</h4>
					<h4>${registro.cantidadhoras}</h4>
					<input type="hidden" name="idEliminar" value="${registro.nromov}">
					<h4><button><a href="/modificar/${registro.nromov}">Modificar</a></h4>
					<h4><input type="submit" value="Eliminar"></h4>
				</form>`;
		});
	} catch (error) {
		console.error('Error:', error);
		alert('Hubo un error al cargar los datos. Por favor, intenta de nuevo más tarde.');
	}
};