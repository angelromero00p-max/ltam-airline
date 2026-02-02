import React, { useState, forwardRef } from 'react';
import { Menu, User, Plane, Briefcase, BedDouble, ChevronDown, ArrowRightLeft, CheckCircle, Info, MapPin, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

registerLocale('es', es);

const CustomDateInput = forwardRef(({ value, onClick, label, placeholder }, ref) => (
  <div 
    className="w-full border border-gray-300 rounded-lg p-3 relative bg-white cursor-pointer hover:border-gray-400 transition-colors"
    onClick={onClick}
    ref={ref}
  >
     <label className="block text-xs font-bold text-[#0B153D] mb-1">{label}</label>
     <div className="flex items-center justify-between">
        <span className={`text-sm ${value ? 'text-[#0B153D]' : 'text-gray-600'}`}>
          {value || placeholder}
        </span>
        <Calendar className="w-5 h-5 text-[#0B153D]" />
     </div>
  </div>
));

const colombianAirports = [
  { code: 'BOG', city: 'Bogotá', name: 'El Dorado' },
  { code: 'MDE', city: 'Medellín', name: 'José María Córdova' },
  { code: 'CLO', city: 'Cali', name: 'Alfonso Bonilla Aragón' },
  { code: 'CTG', city: 'Cartagena', name: 'Rafael Núñez' },
  { code: 'BAQ', city: 'Barranquilla', name: 'Ernesto Cortissoz' },
  { code: 'ADZ', city: 'San Andrés', name: 'Gustavo Rojas Pinilla' },
  { code: 'SMR', city: 'Santa Marta', name: 'Simón Bolívar' },
  { code: 'PEI', city: 'Pereira', name: 'Matecaña' },
  { code: 'CUC', city: 'Cúcuta', name: 'Camilo Daza' },
  { code: 'BGA', city: 'Bucaramanga', name: 'Palonegro' },
  { code: 'MTR', city: 'Montería', name: 'Los Garzones' },
  { code: 'LET', city: 'Leticia', name: 'Alfredo Vásquez Cobo' },
  { code: 'AXM', city: 'Armenia', name: 'El Edén' },
  { code: 'RCH', city: 'Riohacha', name: 'Almirante Padilla' },
  { code: 'EYP', city: 'Yopal', name: 'El Alcaraván' },
  { code: 'APO', city: 'Apartadó', name: 'Antonio Roldán Betancourt' },
  { code: 'AUC', city: 'Arauca', name: 'Santiago Pérez Quiroz' },
  { code: 'BSC', city: 'Bahía Solano', name: 'José Celestino Mutis' },
  { code: 'EJA', city: 'Barrancabermeja', name: 'Yariguíes' },
  { code: 'GYM', city: 'Bogotá', name: 'Guaymaral' },
  { code: 'CAQ', city: 'Caucasia', name: 'Juan H. White' },
  { code: 'FLA', city: 'Florencia', name: 'Gustavo Artunduaga' },
  { code: 'GPI', city: 'Guapi', name: 'Juan Casiano' },
  { code: 'IBE', city: 'Ibagué', name: 'Perales' },
  { code: 'IPI', city: 'Ipiales', name: 'San Luis' },
  { code: 'LMC', city: 'La Macarena', name: 'Javier Noreña Valencia' },
  { code: 'MZL', city: 'Manizales', name: 'La Nubia' },
  { code: 'EOH', city: 'Medellín', name: 'Enrique Olaya Herrera' },
  { code: 'VGZ', city: 'Mocoa', name: 'De Villagarzón' },
  { code: 'LMN', city: 'Maicao', name: 'Jorge Isaacs' },
  { code: 'MVP', city: 'Mitú', name: 'Fabio Alberto León Bentley' },
  { code: 'NVA', city: 'Neiva', name: 'Benito Salas' },
  { code: 'NQU', city: 'Nuquí', name: 'Reyes Murillo' },
  { code: 'PSO', city: 'Pasto', name: 'Antonio Nariño' },
  { code: 'PTX', city: 'Pitalito', name: 'Contador' },
  { code: 'PPN', city: 'Popayán', name: 'Guillermo León Valencia' },
  { code: 'PVA', city: 'Providencia', name: 'El Embrujo' },
  { code: 'PUU', city: 'Puerto Asís', name: 'Tres de Mayo' },
  { code: 'PGT', city: 'Puerto Gaitán', name: 'Morelia' },
  { code: 'PDA', city: 'Puerto Inírida', name: 'César Gaviria Trujillo' },
  { code: 'LQM', city: 'Puerto Leguízamo', name: 'Caucayá' },
  { code: 'PCR', city: 'Puerto Carreño', name: 'Germán Olano' },
  { code: 'UIB', city: 'Quibdó', name: 'El Caraño' },
  { code: 'SJE', city: 'San José del Guaviare', name: 'Jorge Enrique González' },
  { code: 'RVE', city: 'Saravena', name: 'Los Colonizadores' },
  { code: 'CZU', city: 'Sincelejo', name: 'Las Brujas' },
  { code: 'TCO', city: 'Tumaco', name: 'La Florida' },
  { code: 'URA', city: 'Uribia', name: 'Puerto Bolívar' },
  { code: 'VUP', city: 'Valledupar', name: 'Alfonso López Pumarejo' },
  { code: 'VVC', city: 'Villavicencio', name: 'Vanguardia' },
];

function Home() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const passengers = adults + children;
  const [cabin, setCabin] = useState('Economy');
  const [showPassengerSelector, setShowPassengerSelector] = useState(false);
  const [showCabinSelector, setShowCabinSelector] = useState(false);

  const filterAirports = (query) => {
    if (!query) return colombianAirports;
    const lowerQuery = query.toLowerCase();
    return colombianAirports.filter(airport => 
      airport.city.toLowerCase().includes(lowerQuery) || 
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery)
    );
  };

  const handleOriginSelect = (airport) => {
    setOrigin(`${airport.city} (${airport.code})`);
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelect = (airport) => {
    setDestination(`${airport.city} (${airport.code})`);
    setShowDestinationSuggestions(false);
  };

  const handleSearch = () => {
    navigate(ROUTES.RESULTS, {
      state: {
        origin,
        destination,
        startDate: startDate ? startDate.toISOString() : null,
        returnDate: returnDate ? returnDate.toISOString() : null,
        tripType,
        passengers,
        cabin
      }
    });
  };

  const offers = [
    { city: 'Medellín', price: 'COP 150.000', image: 'https://images.unsplash.com/photo-1599593252174-88463f825225?auto=format&fit=crop&w=400&q=80' },
    { city: 'Cartagena', price: 'COP 220.000', image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=400&q=80' },
    { city: 'San Andrés', price: 'COP 350.000', image: 'https://images.unsplash.com/photo-1544015759-33ae4c866d95?auto=format&fit=crop&w=400&q=80' },
    { city: 'Miami', price: 'USD 250', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="min-h-screen bg-gray-200 font-sans pb-20">
      {/* Header */}
      <header className="bg-[#0B153D] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-wider">LATAM</span>
            <span className="text-[0.6rem] tracking-widest text-gray-300">AIRLINES</span>
          </div>
          <div className="text-red-500">
             {/* Logo Icon mark placeholder */}
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

      {/* Navigation Tabs */}
      <nav className="bg-[#0B153D] pt-2">
        <div className="flex overflow-x-auto no-scrollbar">
          <button className="flex-1 min-w-[100px] bg-white text-[#0B153D] py-3 px-4 rounded-t-lg relative flex items-center justify-center gap-2">
            <Plane className="w-5 h-5 -rotate-45" />
            <span className="font-medium">Vuelos</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8114B]"></div>
          </button>
          
          <button className="flex-1 min-w-[100px] text-white py-3 px-4 relative flex items-center justify-center gap-2 opacity-80">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC107] text-[#0B153D] text-[10px] font-bold px-2 py-0.5 rounded-full">
              Ahorra
            </div>
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Paquetes</span>
          </button>
          
          <button className="flex-1 min-w-[100px] text-white py-3 px-4 relative flex items-center justify-center gap-2 opacity-80">
            <BedDouble className="w-5 h-5" />
            <span className="font-medium truncate">Alojamient</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="bg-[#0B153D] pb-12"> {/* Background extension behind the card */}
        <div className="px-4 pt-4">
          
          {/* Flight Search Card */}
          <div className="bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-[#0B153D] font-normal">Busca tu próximo vuelo</h2>
              <button className="border border-gray-300 rounded-full p-1">
                <ChevronDown className="w-5 h-5 text-[#E8114B]" />
              </button>
            </div>

            {/* Trip Type Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button 
                onClick={() => setTripType('roundtrip')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  tripType === 'roundtrip' 
                    ? 'bg-[#E8114B]/10 text-[#0B153D] border-[#0B153D]' 
                    : 'text-gray-500 border-transparent hover:bg-gray-50'
                }`}
              >
                {tripType === 'roundtrip' && <span className="mr-1 text-[#0B153D]">✓</span>}
                Ida y vuelta
              </button>
              <button 
                onClick={() => setTripType('oneway')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  tripType === 'oneway' 
                    ? 'bg-[#E8114B]/10 text-[#0B153D] border-[#0B153D]' 
                    : 'text-gray-500 border-gray-200'
                }`}
              >
                 {tripType === 'oneway' && <span className="mr-1 text-[#0B153D]">✓</span>}
                Solo ida
              </button>
              <button 
                onClick={() => setTripType('multicity')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  tripType === 'multicity' 
                    ? 'bg-[#E8114B]/10 text-[#0B153D] border-[#0B153D]' 
                    : 'text-gray-500 border-gray-200'
                }`}
              >
                 {tripType === 'multicity' && <span className="mr-1 text-[#0B153D]">✓</span>}
                Multidestino
              </button>
            </div>

            {/* Inputs */}
            <div className="relative flex flex-col gap-0 border border-gray-300 rounded-lg">
              <div className="p-4 border-b border-gray-300 relative">
                <label className="block text-xs font-bold text-[#0B153D] mb-1">Desde</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setShowOriginSuggestions(true);
                    }}
                    onFocus={() => setShowOriginSuggestions(true)}
                    placeholder="Ingresa un origen" 
                    className="w-full outline-none text-gray-600 placeholder-gray-400"
                  />
                  {showOriginSuggestions && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto mt-2">
                      {filterAirports(origin).map((airport) => (
                        <div 
                          key={airport.code}
                          onClick={() => handleOriginSelect(airport)}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-bold text-[#0B153D]">{airport.city}</div>
                            <div className="text-xs text-gray-500">{airport.name} ({airport.code})</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                 <button 
                    onClick={() => {
                      const temp = origin;
                      setOrigin(destination);
                      setDestination(temp);
                    }}
                    className="bg-white rounded-full p-2 border border-gray-200 shadow-sm text-[#E8114B] hover:bg-gray-50 transition-colors"
                 >
                    <ArrowRightLeft className="w-4 h-4 rotate-90" />
                 </button>
              </div>

              <div className="p-4 bg-white relative rounded-b-lg">
                <label className="block text-xs font-bold text-[#0B153D] mb-1">Hacia</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowDestinationSuggestions(true);
                    }}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    placeholder="Ingresa un destino" 
                    className="w-full outline-none text-gray-600 placeholder-gray-400"
                  />
                  {showDestinationSuggestions && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto mt-2">
                      {filterAirports(destination).map((airport) => (
                        <div 
                          key={airport.code}
                          onClick={() => handleDestinationSelect(airport)}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-bold text-[#0B153D]">{airport.city}</div>
                            <div className="text-xs text-gray-500">{airport.name} ({airport.code})</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Inputs & Others */}
            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                 <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    customInput={<CustomDateInput label="Ida" placeholder="Selecciona fecha" />}
                    locale="es"
                    dateFormat="dd MMM yyyy"
                    minDate={new Date()}
                 />
              </div>
              
              {tripType === 'roundtrip' && (
                <div className="flex-1">
                   <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      customInput={<CustomDateInput label="Vuelta" placeholder="Selecciona fecha" />}
                      locale="es"
                      dateFormat="dd MMM yyyy"
                      minDate={startDate || new Date()}
                   />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 relative">
               <div 
                 className="flex-1 border border-gray-300 rounded-lg p-3 bg-white cursor-pointer hover:border-gray-400 transition-colors relative"
                 onClick={() => {
                   setShowPassengerSelector(!showPassengerSelector);
                   setShowCabinSelector(false);
                 }}
               >
                 <label className="block text-xs font-bold text-[#0B153D] mb-1">Pasajeros</label>
                 <div className="flex items-center justify-between">
                    <span className="text-[#0B153D] text-sm font-medium">{passengers} {passengers === 1 ? 'Pasajero' : 'Pasajeros'}</span>
                    <User className="w-5 h-5 text-[#0B153D]" />
                 </div>
                 
                 {showPassengerSelector && (
                   <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 p-2">
                     {/* Adults */}
                     <div className="mb-2 border-b border-gray-100 pb-2">
                       <div className="text-sm font-bold text-[#0B153D] mb-2 px-2">Adultos</div>
                       <div className="flex items-center justify-between px-2">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (adults > 1) setAdults(adults - 1);
                           }}
                           className={`w-8 h-8 rounded-full border flex items-center justify-center ${adults <= 1 ? 'border-gray-200 text-gray-300' : 'border-[#E8114B] text-[#E8114B]'}`}
                           disabled={adults <= 1}
                         >
                           -
                         </button>
                         <span className="font-bold text-[#0B153D]">{adults}</span>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (passengers < 9) setAdults(adults + 1);
                           }}
                           className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengers >= 9 ? 'border-gray-200 text-gray-300' : 'border-[#E8114B] text-[#E8114B]'}`}
                           disabled={passengers >= 9}
                         >
                           +
                         </button>
                       </div>
                     </div>

                     {/* Children */}
                     <div>
                       <div className="text-sm font-bold text-[#0B153D] mb-2 px-2">Niños</div>
                       <div className="flex items-center justify-between px-2 pb-2">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (children > 0) setChildren(children - 1);
                           }}
                           className={`w-8 h-8 rounded-full border flex items-center justify-center ${children <= 0 ? 'border-gray-200 text-gray-300' : 'border-[#E8114B] text-[#E8114B]'}`}
                           disabled={children <= 0}
                         >
                           -
                         </button>
                         <span className="font-bold text-[#0B153D]">{children}</span>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (passengers < 9) setChildren(children + 1);
                           }}
                           className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengers >= 9 ? 'border-gray-200 text-gray-300' : 'border-[#E8114B] text-[#E8114B]'}`}
                           disabled={passengers >= 9}
                         >
                           +
                         </button>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
               
               <div 
                 className="flex-1 border border-gray-300 rounded-lg p-3 bg-white cursor-pointer hover:border-gray-400 transition-colors relative"
                 onClick={() => {
                   setShowCabinSelector(!showCabinSelector);
                   setShowPassengerSelector(false);
                 }}
               >
                 <label className="block text-xs font-bold text-[#0B153D] mb-1">Cabina</label>
                 <div className="flex items-center justify-between">
                    <span className="text-[#0B153D] text-sm font-medium">{cabin}</span>
                    <ChevronDown className="w-5 h-5 text-[#0B153D]" />
                 </div>

                 {showCabinSelector && (
                   <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2">
                     {['Economy', 'Premium Economy', 'Premium Business'].map((c) => (
                       <div 
                         key={c}
                         onClick={(e) => {
                           e.stopPropagation(); // Prevent closing immediately
                           setCabin(c);
                           setShowCabinSelector(false);
                         }}
                         className={`p-3 hover:bg-gray-50 cursor-pointer text-sm font-medium ${cabin === c ? 'text-[#E8114B] bg-red-50' : 'text-[#0B153D]'}`}
                       >
                         {c}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={!startDate || (tripType === 'roundtrip' && !returnDate)}
              className={`w-full font-bold py-4 rounded-full mt-6 transition-colors ${
                !startDate || (tripType === 'roundtrip' && !returnDate)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#E8114B] text-white hover:bg-[#d00f43]'
              }`}
            >
              BUSCAR
            </button>
          </div>

          {/* Promo Card */}
          <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden flex relative">
            <div className="flex-1 p-5 z-10">
               <div className="inline-block bg-[#E8114B] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                 Alojamientos
               </div>
               <h3 className="text-xl text-[#0B153D] font-bold leading-tight mb-1">
                 Tu refugio ideal
               </h3>
               <div className="text-[#0B153D] text-sm mb-3">
                 desde <span className="text-4xl font-bold">15%</span> <span className="text-xs">dcto.</span>
               </div>
               
               <div className="text-[10px] text-gray-600 mb-1">Acumula Millas LATAM Pass</div>
               <div className="text-[10px] text-[#E8114B] mb-1">+ Puntos Calificables</div>
               <div className="text-[10px] text-[#0B153D] mb-4">+ Beneficios Genius</div>
               
               <button className="bg-[#E8114B] text-white text-xs font-bold px-6 py-2 rounded-full uppercase">
                 Acumula Millas
               </button>
            </div>
            
            <div className="w-2/5 relative">
              <img 
                src="https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Relaxing woman" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent"></div>
            </div>
            
             {/* Opina Label */}
             <div className="absolute -bottom-6 -right-8 bg-[#383d55] text-white text-xs px-8 py-1 rotate-[-45deg] origin-top-left z-20">
               Opina
             </div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-normal text-[#0B153D] mb-6">Descubre tu próximo destino</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {offers.map((offer, index) => (
            <div key={index} className="min-w-[200px] bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-32 relative">
                <img src={offer.image} alt={offer.city} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-[#E8114B] text-white text-xs font-bold px-2 py-0.5 rounded">
                  OFERTA
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">Vuelo desde Bogotá</div>
                <h3 className="text-lg font-bold text-[#0B153D] mb-2">{offer.city}</h3>
                <div className="text-xs text-gray-500">Precio final desde</div>
                <div className="text-xl font-bold text-[#0B153D]">{offer.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 px-4 bg-white">
        <h2 className="text-xl font-normal text-[#0B153D] mb-6">Gestiona tu viaje</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#0B153D]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-[#0B153D]">Check-in</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#0B153D]">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-[#0B153D]">Mis viajes</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#0B153D]">
              <Info className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-[#0B153D]">Estado del vuelo</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B153D] text-white py-8 px-4">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Sobre LATAM</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Información corporativa</li>
              <li>Sostenibilidad</li>
              <li>Relación con inversionistas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Ayuda</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Centro de Ayuda</li>
              <li>Devoluciones</li>
              <li>Contacto</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
          <p>© 2024 LATAM Airlines Group. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;