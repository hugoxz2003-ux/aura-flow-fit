const data = {
    name: "Hugo Test n8n Final (Verificacion)",
    email: "contacto@auraflow.cl",
    message: "Test automático final de verificación de flujo"
};

fetch('https://n8n.auraflow.cl/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
    .then(res => res.text())
    .then(text => console.log('Response Final:', text))
    .catch(err => console.error('Error:', err));
