import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ArrowRight, ChevronDown } from 'lucide-react';
import { ROUTES } from '../routes';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { origin, destination, startDate, returnDate, tripType, selectedOutbound: initialOutbound, passengers = 1, cabin = 'Economy' } = location.state || {};
  
  const [selectedOutbound, setSelectedOutbound] = useState(initialOutbound || null);

  // Mock flight data
  const flights = [
    {
      id: 1,
      departureTime: '6:30 a. m.',
      arrivalTime: '7:30 a. m.',
      duration: '1 h',
      originCode: origin?.split('(')[1]?.replace(')', '') || 'MDE',
      destinationCode: destination?.split('(')[1]?.replace(')', '') || 'BOG',
      price: 71000,
      type: 'Directo',
      tag: 'Más económico'
    },
    {
      id: 2,
      departureTime: '9:15 a. m.',
      arrivalTime: '10:15 a. m.',
      duration: '1 h',
      originCode: origin?.split('(')[1]?.replace(')', '') || 'MDE',
      destinationCode: destination?.split('(')[1]?.replace(')', '') || 'BOG',
      price: 87000,
      type: 'Directo',
      tag: 'Más rápido'
    },
    {
      id: 3,
      departureTime: '12:45 p. m.',
      arrivalTime: '1:45 p. m.',
      duration: '1 h',
      originCode: origin?.split('(')[1]?.replace(')', '') || 'MDE',
      destinationCode: destination?.split('(')[1]?.replace(')', '') || 'BOG',
      price: 105000,
      type: 'Directo',
      tag: null
    },
    {
      id: 4,
      departureTime: '4:20 p. m.',
      arrivalTime: '5:20 p. m.',
      duration: '1 h',
      originCode: origin?.split('(')[1]?.replace(')', '') || 'MDE',
      destinationCode: destination?.split('(')[1]?.replace(')', '') || 'BOG',
      price: 151600,
      type: 'Directo',
      tag: null
    },
    {
      id: 5,
      departureTime: '8:00 p. m.',
      arrivalTime: '9:00 p. m.',
      duration: '1 h',
      originCode: origin?.split('(')[1]?.replace(')', '') || 'MDE',
      destinationCode: destination?.split('(')[1]?.replace(')', '') || 'BOG',
      price: 316500,
      type: 'Directo',
      tag: null
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  const [selectedFlightId, setSelectedFlightId] = useState(null);

  const handleFlightClick = (flight) => {
    setSelectedFlightId(flight.id);
  };

  const handleContinue = () => {
    const flight = flights.find(f => f.id === selectedFlightId);
    if (!flight) return;

    if (tripType === 'roundtrip' && !selectedOutbound) {
      navigate(ROUTES.RETURN_RESULTS, {
        state: {
          origin: destination,
          destination: origin,
          startDate: returnDate,
          returnDate: null,
          tripType: 'roundtrip',
          selectedOutbound: flight,
          passengers,
          cabin
        }
      });
      window.scrollTo(0, 0);
    } else {
      // Navigate to passengers page
      navigate(ROUTES.PASSENGERS, {
        state: {
          origin: location.state?.origin || origin,
          destination: location.state?.destination || destination,
          startDate: location.state?.startDate || startDate,
          returnDate: location.state?.returnDate || returnDate,
          tripType: tripType,
          selectedOutbound: selectedOutbound || flight, // If roundtrip, use stored outbound. If oneway, use current flight.
          selectedInbound: selectedOutbound ? flight : null, // If roundtrip, current flight is inbound.
          passengers,
          cabin
        }
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
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

      {/* Search Summary Bar */}
      <div className="bg-white shadow-sm p-4 sticky top-[68px] z-40">
        <div className="border border-[#E8114B] rounded-lg p-3 flex justify-between items-center bg-white">
           <div>
             <div className="flex items-center gap-2 text-[#E8114B] font-bold text-sm">
               <span>{origin?.split(',')[0] || 'Origen'}</span>
               <ArrowRight className="w-4 h-4" />
               <span>{destination?.split(',')[0] || 'Destino'}</span>
             </div>
             <div className="text-xs text-gray-600 mt-1 capitalize">
               {formatDate(startDate)} {returnDate ? `a ${formatDate(returnDate)}` : ''}
             </div>
           </div>
           <button className="text-[#E8114B] text-sm font-medium hover:underline">
             Modificar
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-3xl mx-auto pb-20">
        <h1 className="text-2xl text-[#0B153D] font-light mb-2">
          Elige un <span className="font-normal">vuelo de {selectedOutbound ? 'vuelta' : 'ida'}</span>
        </h1>
        
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span>Ordenado por:</span>
          <button className="font-bold text-[#0B153D] flex items-center gap-1">
            Recomendado <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mb-4">
          El orden aplicará para tu vuelo de {selectedOutbound ? 'vuelta' : 'ida y vuelta'}.
        </p>

        <div className="space-y-4 mb-24">
          {flights.map((flight) => (
            <div 
              key={flight.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border cursor-pointer transition-all ${
                selectedFlightId === flight.id 
                  ? 'border-[#E8114B] ring-1 ring-[#E8114B] shadow-lg' 
                  : 'border-gray-100 hover:shadow-lg'
              }`}
              onClick={() => handleFlightClick(flight)}
            >
              {flight.tag && (
                <div className="flex">
                  <div className="bg-[#FFC107] text-[#0B153D] text-xs font-bold px-3 py-1">
                    Recomendado
                  </div>
                  <div className="bg-[#008C95] text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                    {flight.tag}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex gap-8 items-center">
                     <div className="text-center">
                       <div className="text-2xl text-[#0B153D]">{flight.departureTime}</div>
                       <div className="text-xs text-gray-500">{flight.originCode}</div>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="text-xs text-gray-400 mb-1">Duración {flight.duration}</div>
                       <div className="w-16 h-[1px] bg-gray-300 relative">
                         <div className="absolute -top-1 right-0 w-2 h-2 border-t border-r border-gray-300 rotate-45"></div>
                       </div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl text-[#0B153D]">{flight.arrivalTime}</div>
                       <div className="text-xs text-gray-500">{flight.destinationCode}</div>
                     </div>
                   </div>
                   
                   {/* Selection Indicator */}
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                     selectedFlightId === flight.id ? 'border-[#E8114B]' : 'border-gray-300'
                   }`}>
                     {selectedFlightId === flight.id && (
                       <div className="w-3 h-3 rounded-full bg-[#E8114B]"></div>
                     )}
                   </div>
                </div>
                
                <div className="flex justify-between items-end">
                   <div>
                     <span className="text-[#5C2E91] text-sm font-medium border-b border-[#5C2E91] cursor-pointer">
                       {flight.type}
                     </span>
                     <div className="flex items-center gap-2 mt-2">
                       <span className="text-xs text-gray-500">Operado por</span>
                       <div className="flex items-center gap-1">
                         <div className="text-[#E8114B]">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2,2 L10,2 L2,10 Z" />
                              <path d="M12,4 L20,4 L12,12 Z" />
                              <path d="M4,14 L12,14 L4,22 Z" />
                           </svg>
                         </div>
                         <span className="text-xs text-gray-500">LATAM Airlines Colombia</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-right">
                     <div className="text-xs text-[#008C95] font-medium mb-1">{passengers > 1 ? 'Precio total' : 'Por persona desde'}</div>
                     <div className="text-2xl font-bold text-[#0B153D]">
                       COP {(flight.price * passengers).toLocaleString('es-CO')}
                     </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Bar with Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 flex justify-between items-center z-50">
         <div className="text-[#0B153D]">
           <div className="text-xs">Precio total desde</div>
           <div className="text-xl font-bold">
             {selectedFlightId ? `COP ${(flights.find(f => f.id === selectedFlightId)?.price * passengers).toLocaleString('es-CO')}` : '-'}
           </div>
         </div>
         <button 
           onClick={handleContinue}
           disabled={!selectedFlightId}
           className={`px-8 py-3 rounded-full font-bold transition-colors ${
             selectedFlightId 
               ? 'bg-[#E8114B] text-white hover:bg-[#d00f43]' 
               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
           }`}
         >
           Continuar
         </button>
      </div>
    </div>
  );
}

export default SearchResults;