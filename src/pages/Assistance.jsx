import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, ChevronUp, Check, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../routes';

function Assistance() {
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

  // Calcular precio total (vuelos + servicios extra si los hubiera)
  const calculateTotal = () => {
    let total = 0;
    if (selectedOutbound) total += selectedOutbound.price;
    if (selectedInbound) total += selectedInbound.price;
    return total;
  };

  const totalPrice = calculateTotal();

  // Obtener iniciales del pasajero
  const getInitials = (name, surname) => {
    return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
  };

  const handleContinue = () => {
    navigate(ROUTES.PAYMENT, {
      state: {
        origin,
        destination,
        startDate,
        returnDate,
        tripType,
        selectedOutbound,
        selectedInbound,
        formData
      }
    });
    window.scrollTo(0, 0);
  };

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
          Pasajeros
        </h1>

        {/* Resumen Pasajero */}
        <div className="bg-white rounded-lg shadow-sm mb-8 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#4152B5] text-white flex items-center justify-center font-bold text-sm">
              {getInitials(formData?.name, formData?.surname)}
            </div>
            <div>
              <div className="text-[#0B153D] font-bold text-sm">
                {formData?.name} {formData?.surname}
              </div>
              <div className="text-gray-500 text-xs">
                - {formData?.docType?.includes('Cédula') ? 'C. Identidad' : 'Pasaporte'} - {formData?.docNumber}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-[#8CC63F] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
             </div>
             <ChevronDown className="text-[#E8114B] w-5 h-5" />
          </div>
        </div>

        {/* Sección Assist Card */}
        <div className="flex items-start gap-4 mb-4">
           <div className="bg-white p-1 rounded border shadow-sm w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-[0.5rem] font-bold text-red-600 leading-none text-center">ASSIST CARD</span>
           </div>
           <h2 className="text-[#0B153D] text-xl leading-tight">
             Agrega tu asistencia de viaje y viaja con tranquilidad
           </h2>
        </div>

        {/* Info Asistencia */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
           <div className="flex border-b text-sm">
              <div className="flex-1 p-4 text-center border-r">
                 <div className="text-gray-500 text-xs">Cantidad de personas</div>
                 <div className="font-bold text-[#0B153D]">1 persona</div>
              </div>
              <div className="flex-1 p-4 text-center">
                 <div className="text-gray-500 text-xs">Cobertura por</div>
                 <div className="font-bold text-[#0B153D]">28 días</div>
              </div>
           </div>

           {/* Tarjeta LATAM DOMESTIC */}
           <div className="bg-[#F3F4F8] p-4 m-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-[#0B153D] text-lg mb-1">LATAM DOMESTIC</h3>
              <p className="text-gray-600 text-sm mb-4">Protección total a <span className="font-bold">precio conveniente.</span></p>

              <div className="space-y-3 mb-4">
                 <div className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00A69C] mt-1 flex-shrink-0" />
                    <div>
                       <div className="font-bold text-sm text-[#0B153D]">Imprevistos médicos</div>
                       <div className="text-xs text-gray-500">Asistencia por enfermedad y accidente: <span className="font-bold text-black">USD 5.000</span></div>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00A69C] mt-1 flex-shrink-0" />
                    <div>
                       <div className="font-bold text-sm text-[#0B153D]">Problemas con tu equipaje de bodega</div>
                       <div className="text-xs text-gray-500">Asesoramiento en caso de perdida o demora.</div>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00A69C] mt-1 flex-shrink-0" />
                    <div>
                       <div className="font-bold text-sm text-[#0B153D]">Pérdida de documentos</div>
                       <div className="text-xs text-gray-500">Asistencia en caso de robo, hurto y extravío.</div>
                    </div>
                 </div>
              </div>

              <a href="#" className="text-blue-600 underline text-sm block mb-4">Más detalles de cobertura</a>

              <div className="inline-block bg-[#FFF4A3] px-3 py-1 rounded-full text-xs font-bold text-[#0B153D] mb-2 flex items-center gap-1">
                 <span className="text-yellow-600">☺</span> Acumula millas
              </div>

              <div className="text-gray-500 text-sm mb-1">Total para 1 persona</div>
              <div className="text-[#0B153D] font-bold text-xl mb-4">COP 75.564</div>

              <button className="w-full py-2 border border-[#E8114B] text-[#E8114B] font-bold rounded hover:bg-red-50 transition-colors">
                 Agregar
              </button>

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                 Al agregar estás aceptando los <a href="#" className="text-blue-600 underline">términos y condiciones</a>
              </div>
           </div>
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
             onClick={handleContinue}
             className="w-full py-3 font-bold rounded-lg bg-[#E8114B] text-white hover:bg-[#d00f43] transition-colors"
           >
             Continuar
           </button>
         </div>
      </div>
    </div>
  );
}

export default Assistance;
