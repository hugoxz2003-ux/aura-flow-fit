@echo off
echo ==========================================
echo AURA FLOW CRM: DESPLIEGUE DOBLE VERCEL
echo ==========================================
echo.
echo Iniciando despliegue de Aura Flow Fit...
call npx vercel deploy --prod --yes --name aura-flow-fit-crm
echo.
echo Iniciando despliegue de Starfit Chile...
call npx vercel deploy --prod --yes --name starfit-chile-crm
echo.
echo ==========================================
echo PROCESO FINALIZADO
echo Revisa los links arriba para acceder.
echo ==========================================
pause
