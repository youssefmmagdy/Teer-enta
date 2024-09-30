import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateHistoricalPlaces = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // Initialize as an empty string
  const [tag, setTag] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [foreignerPrice, setForeignerPrice] = useState(0);
  const [studentPrice, setStudentPrice] = useState(0);
  const [nativePrice, setNativePrice] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      name,
      location,
      description,
      images: image ? [image] : [], // Ensure this is an array
      tags: [tag],
      openingHours,
      tickets: [
        { type: "Foreigner", price: foreignerPrice },
        { type: "Student", price: studentPrice },
        { type: "Native", price: nativePrice },
      ],
    };
  
    try {
      const response = await axios.post('http://localhost:8000/historicalPlace/create', data);
      if (response.status === 200) {
        toast.success('Historical place created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to create the historical place.');
      }
    } catch (error) {
      console.error('Error creating historical place:', error);
      toast.error('An error occurred while creating the historical place.');
    }
  
    // Reset form
    setName('');
    setLocation('');
    setDescription('');
    setImage(null);
    setTag('');
    setOpeningHours('');
    setForeignerPrice(0);
    setStudentPrice(0);
    setNativePrice(0);
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Historical Place</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500 h-24"
        />

        <div>
          <label className="block text-gray-700">Image URL:</label>
          <input
            type="text"
            placeholder="Enter Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)} 
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500"
          />
          
          {/* Optional: Preview the image if the URL is valid */}
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url.png'; }} // Fallback if image fails to load
              />
            </div>
          )}
        </div>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500"
        >
          <option value="" disabled>
            Tags
          </option>
          <option value="Monuments">Monuments</option>
          <option value="Museums">Museums</option>
          <option value="Religious Sites">Religious Sites</option>
          <option value="Palaces/Castles">Palaces/Castles</option>
        </select>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Opening Hours</h2>
        <input
          type="text"
          placeholder="e.g. 10:00 AM - 5:30 PM"
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500"
        />

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Ticket Prices</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Foreigner Price:</label>
            <input
              type="number"
              placeholder="Price"
              value={foreignerPrice}
              onChange={(e) => setForeignerPrice(Number(e.target.value))} // Convert to number
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500 w-1/3"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Student Price:</label>
            <input
              type="number"
              placeholder="Price"
              value={studentPrice}
              onChange={(e) => setStudentPrice(Number(e.target.value))} // Convert to number
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500 w-1/3"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Native Price:</label>
            <input
              type="number"
              placeholder="Price"
              value={nativePrice}
              onChange={(e) => setNativePrice(Number(e.target.value))} // Convert to number
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-sky-500 w-1/3"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition duration-300 ease-in-out"
        >
          Add Historical Place
        </button>
      </form>
    </div>
  );
};

export default CreateHistoricalPlaces;
