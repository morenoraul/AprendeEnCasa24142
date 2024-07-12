function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const confirmEmail = document.getElementById('confirmEmail').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const confirmContrasena = document.getElementById('confirmContrasena').value.trim();
    const rol = document.getElementById('rol').value;
    const nivelAcademico = document.getElementById('nivelAcademico').value;
    const terminosCondiciones = document.getElementById('terminosCondiciones').checked;
    const condicionesPrivacidad = document.getElementById('condicionesPrivacidad').checked;

    let camposIncompletos = [];

    // Validar campos obligatorios
    if (!nombre) camposIncompletos.push('Nombre');
    if (!apellido) camposIncompletos.push('Apellido');
    if (!email) camposIncompletos.push('Email');
    if (!confirmEmail) camposIncompletos.push('Confirmar Email');
    if (!dni) camposIncompletos.push('DNI');
    if (!contrasena) camposIncompletos.push('Contraseña');
    if (!confirmContrasena) camposIncompletos.push('Confirmar Contraseña');
    if (!rol) camposIncompletos.push('Rol');
    if (!nivelAcademico) camposIncompletos.push('Nivel Académico');
    if (!terminosCondiciones) camposIncompletos.push('Términos y Condiciones');
    if (!condicionesPrivacidad) camposIncompletos.push('Condiciones de Privacidad');

    // Validar coincidencia de email
    if (email !== confirmEmail) {
        camposIncompletos.push('Los emails no coinciden');
    }

    // Validar coincidencia de contraseña
    if (contrasena !== confirmContrasena) {
        camposIncompletos.push('Las contraseñas no coinciden');
    }

    // Validar formato de contraseña
    const contrasenaRegex = /^(?=.*\d)(?=.*[a-záéíóúüñ]).*[^\s]{8,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        camposIncompletos.push('La contraseña debe tener al menos 8 caracteres alfanuméricos');
    }

    if (camposIncompletos.length > 0) {
        mostrarCuadroDialogo('Error', 'Falta completar los siguientes campos:<br>' + camposIncompletos.join('<br>'));
    } else {
        // Enviar datos al servidor para registrar al usuario
        fetch('/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                dni,
                contrasena,
                rol,
                nivelAcademico
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarCuadroDialogo('Éxito', '¡Felicitaciones! Has sido registrado.');
            } else {
                mostrarCuadroDialogo('Error', data.message);
            }
        })
        .catch(error => {
            mostrarCuadroDialogo('Éxito', '¡Felicitaciones! Has sido registrado.');
           //mostrarCuadroDialogo('Error', 'Ha ocurrido un error inesperado.');
           //console.error('Error al registrar usuario:', error);   //ACTIVARLO CUANDO SE COMPLETE CON SERVER
        });
    }
}

function mostrarCuadroDialogo(title, message) {
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal', 'fade');
    modalElement.setAttribute('tabindex', '-1');
    modalElement.setAttribute('role', 'dialog');
    modalElement.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalElement);

    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove();
    });
}

//Login validacion basica!
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let userEmail = document.getElementById('username').value;
    let userPassword = document.getElementById('password').value;

    if (userEmail && userPassword) {
        document.getElementById('boton-acceso'),this.innerHTML = `Bienvenido a la Plataforma.<button class="btn-login" onclick="location.href='index.html'">Volver al Inicio<button/>`;
    } else {
        document.getElementById('alerta-mensaje'),this.innerText = 'Usuario o Contraseña incorrecta'
    }

});