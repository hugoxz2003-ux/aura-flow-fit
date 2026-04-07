const url = 'https://n8n.auraflow.cl/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5';

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre: 'Prueba Agente n8n.auraflow.cl',
        email: 'contacto@auraflow.cl',
        mensaje: 'Revisión automática de dominio personalizado'
    })
})
    .then(res => res.text())
    .then(text => console.log('Response:', text))
    .catch(err => console.error('Error:', err));
