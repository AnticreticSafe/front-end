# Pendientes para cumplir con la challenge

Este archivo resume lo que todavía falta para que el frontend cumpla con lo que piden los `.md` del proyecto y de la challenge.

## Bloqueantes

- [ ] Eliminar el uso de datos mock en el flujo principal.
- [ ] Reemplazar `mockAgreements` por datos reales provenientes de contratos, subgraph o backend.
- [ ] Conectar la creación de acuerdos con una transacción real en cadena.
- [ ] Hacer que la vista de detalle lea y actualice estados reales del contrato.
- [ ] Sustituir las acciones marcadas como `Mock actions` por llamadas funcionales.
- [ ] Confirmar que el flujo de registro de monto confidencial funciona de extremo a extremo con red real.
- [ ] Verificar que el flujo de mint/decrypt usa contratos desplegados y no solo estados locales.
- [ ] Probar la app completa en Arbitrum Sepolia con wallet conectada.

## Integración Nox / Confidential Tokens

- [ ] Validar que los `handle` y `inputProof` provienen siempre de `@iexec-nox/handle`.
- [ ] Revisar que el contrato receptor autorizado coincide con el contrato que valida el handle.
- [ ] Confirmar permisos ACL para lectura y decryption de balances confidenciales.
- [ ] Revisar si hay casos donde se genera un hash o handle de forma simulada y cambiarlo por uno real.

## Entrega exigida por la challenge

- [ ] Crear `feedback.md` con feedback sobre las herramientas iExec.
- [ ] Verificar que el `README.md` explica instalación, uso y despliegue reales.
- [ ] Documentar direcciones de contratos, red usada y pasos de despliegue.
- [ ] Preparar y enlazar un video demo de máximo 4 minutos.
- [ ] Confirmar que el repositorio público contiene todo el código necesario.

## UX y producto

- [ ] Quitar o etiquetar claramente cualquier pantalla que siga siendo demo o mock.
- [ ] Revisar textos que todavía prometen funcionalidad que no está implementada.
- [ ] Ajustar estados de carga, error y éxito para reflejar transacciones reales.
- [ ] Validar que el flujo completo sea entendible por un usuario externo sin contexto previo.

## Sugerencia de orden de trabajo

1. Reemplazar mocks por datos reales.
2. Cerrar el flujo on-chain principal.
3. Añadir `feedback.md` y completar la documentación.
4. Revisar UX y pulir mensajes finales.