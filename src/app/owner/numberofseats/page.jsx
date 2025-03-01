'use client';
import React, { useState } from 'react';
import { useSalon } from '@/context/SalonContext';
import { UPDATE_NUMBER_OF_SEATS_FN } from '@/services/ownerService';
import { useRouter } from 'next/navigation';


const SeatsInput = () => {
  const [seats, setSeats] = useState('');
  const {salon_id} = useSalon();
  const router = useRouter()
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 99)) {
      setSeats(value);
    }
  };

  const handleSubmit = async()=>{
    try{
      const response = await UPDATE_NUMBER_OF_SEATS_FN(salon_id, seats)
      console.log(response);
      if(response.status == 200){
        router.replace('/owner/salontime')
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-8 w-64">
          <img
            src="../fav-image.png"
            alt="Salon Chair"
            className="w-full h-auto"
          />
        </div>
        
        <div className="w-full text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            How many <span className="text-[#CE145B]">Seats</span> are
          </h1>
          <h1 className="text-3xl font-bold">available ?</h1>
        </div>

        <div className="w-full mb-6">
          <input
            type="text"
            value={seats}
            onChange={handleChange}
            placeholder="eg: 7"
            className="w-full p-4 rounded-2xl bg-white text-lg border focus:outline-none focus:border-[#CE145B]"
          />
        </div>

        <button 
          className="w-full p-4 rounded-xl bg-[#CE145B] text-white font-semibold text-lg hover:bg-opacity-90 transition-colors"
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SeatsInput;