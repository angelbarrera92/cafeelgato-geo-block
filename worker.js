/**
 * Cloudflare Worker para geo-bloqueo de Café El Gato
 * 
 * Este worker detecta si la conexión viene de España.
 * Si NO es España, redirige a la página de geo-bloqueo.
 * Si es España, permite el acceso a la tienda principal.
 */

export default {
  async fetch(request, env) {
    // Obtener el país del visitante desde Cloudflare
    const country = request.cf?.country;
    
    // URL de la página de geo-bloqueo (actualiza esta URL después del despliegue)
    const GEO_BLOCK_URL = 'https://ouch.cafeelgato.com';
    
    // Si el visitante NO es de España, redirigir a la página de geo-bloqueo
    if (country !== 'ES') {
      // Evitar bucle de redirección si ya está en la página de geo-bloqueo
      const url = new URL(request.url);
      
      // Verificar que no estamos en la página de geo-bloqueo
      if (!url.hostname.includes('ouch.cafeelgato.com')) {
        return Response.redirect(GEO_BLOCK_URL, 302);
      }
    }
    
    // Si es España o ya está en la página de geo-bloqueo, continuar normalmente
    // El worker pasa la petición al origin sin modificar
    return fetch(request);
  }
}
