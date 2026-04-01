const url = 'https://auraflowfit.app.n8n.cloud/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5';

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre: 'Prueba Agente 2',
        email: 'contacto@auraflow.cl',
        mensaje: 'Revisión automática de n8n'
    })
})
    .then(res => res.text())
    .then(text => console.log('Response 2:', text))
    .catch(err => console.error('Error:', err));
