// Teer-Enta/frontend/api/itineraryApi.ts
import axios from 'axios';
import { TItinerary } from '../types/Itinerary/Itinerary';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getItineraries = async (): Promise<TItinerary[]> => {
    console.log('API_BASE_URL', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/itinerary`);
    console.log('response', response.data);
    return response.data;
};

export const createItinerary = async (itinerary: Partial<TItinerary>): Promise<TItinerary> => {
    const response = await axios.post(`${API_BASE_URL}/itinerary/create`, itinerary);
    return response.data;
};

export const updateItinerary = async (id: string, itinerary: Partial<TItinerary>): Promise<TItinerary> => {
    console.log("Itinerary", itinerary);
    const response = await axios.put(`${API_BASE_URL}/itinerary/update/${id}`, itinerary);
    return response.data;
};

export const deleteItinerary = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/itinerary/delete/${id}`);
};