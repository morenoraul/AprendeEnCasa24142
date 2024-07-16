document.addEventListener('DOMContentLoaded', async function() {
	try {
			const token = localStorage.getItem('jwt-token');
			if (!token) {
					throw new Error('No token found');
			}

			const res = await fetch('/listado', {
					method: 'GET',
					headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
					}
			});

			if (!res.ok) {
					throw new Error('Network response was not ok');
			}

			const datos = await res.json();
			let listaHTML = document.querySelector('#listado');
			listaHTML.innerHTML = '';

			datos.forEach(registro => {
					listaHTML.innerHTML += `
					<div style="display:flex">
							<h4>${registro.codcurso}</h4>
							<h4>${registro.precio}</h4>
							<h4>${registro.cantidadhoras}</h4>
							<h4><button onclick="modificarRegistro(${registro.nromov})">Modificar</button></h4>
							<h4><button onclick="eliminarRegistro(${registro.nromov})">Eliminar</button></h4>
					</div>`;
			});
	} catch (error) {
			console.error('There has been a problem with your fetch operation:', error);
			window.location.href = "/login.html";
	}
});

async function eliminarRegistro(id) {
	try {
			const token = localStorage.getItem('jwt-token');
			const res = await fetch(`/listado/${id}`, {
					method: 'DELETE',
					headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
					}
			});

			if (!res.ok) {
					throw new Error('Failed to delete');
			}

			// Recargar la lista después de eliminar
			location.reload();
	} catch (error) {
			console.error('Error al eliminar:', error);
			alert('No se pudo eliminar el registro');
	}
}

function modificarRegistro(id) {
	window.location.href = `/modificar/${id}`;
}

/*document.querySelector('body').onload = async () => {
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
};*/