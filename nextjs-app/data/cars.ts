import { getSupabaseClient } from '../utils/supabase';

export interface Car {
  id: number;
  brand: string;
  model: string;
  type: string;
  year: number;
  seats: number;
  gear: string;
  color: string;
  price: string;
  description: string;
  image: string;
}

export const getCars = async (): Promise<Car[]> => {
  const { data, error } = await getSupabaseClient()
    .from('cars')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }

  return data || [];
};

export const getCarById = async (id: number): Promise<Car | null> => {
  const { data, error } = await getSupabaseClient()
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    return null;
  }

  return data;
};
