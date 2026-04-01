const url = 'https://n8n.auraflow.cl/webhook/f98fa7cc-f925-4122-8356-9be896957297';

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Prueba Agente',
        email: 'contacto@auraflow.cl',
        message: 'Revisión automática de n8n'
    })
})
    .then(res => res.text())
    .then(text => console.log('Response:', text))
    .catch(err => console.error('Error:', err));
