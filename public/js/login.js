const login = async () => {
	const user = document.querySelector(`[name='user']`).value
  const password = document.querySelector(`[name='password']`).value
  const resp = await fetch(`/login/login`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password }) 
  })
  if(resp.status === 404){
    throw ("Usuario inválido")
  } else if(resp.status === 401){
    throw ("Password incorrecto")
  }
  const data = await resp.json()
  localStorage.setItem("jwt-token", data.token)
  window.location.href="/listado.html"
}