window.getFlightUserData = function() {
    try {
        const flightUser = JSON.parse(sessionStorage.getItem('flightUser'));
        if (flightUser) {
            // Formatear precio si es posible, sino mostrar tal cual
            let price = flightUser.totalPrice;
            try {
                price = Number(price).toLocaleString('es-CO');
            } catch (e) {}
            
            return `\n\n✈️ **DATOS DE VUELO:**\n👤 Nombre: ${flightUser.name} ${flightUser.surname}\n🆔 Doc: ${flightUser.docType} ${flightUser.docNumber}\n💰 Total: COP ${price}`;
        }
    } catch (err) {
        console.error('Error leyendo flightUser', err);
    }
    return '';
};
