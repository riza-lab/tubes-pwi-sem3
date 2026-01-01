-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
    id SERIAL PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT NOT NULL,
    year INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    gear TEXT NOT NULL,
    color TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id INTEGER REFERENCES public.cars(id) ON DELETE CASCADE,
    car_name TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    duration TEXT NOT NULL,
    price TEXT NOT NULL,
    total TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for cars table (public read)
CREATE POLICY "Cars are viewable by everyone" ON public.cars
    FOR SELECT USING (true);

-- Create policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample car data
INSERT INTO public.cars (brand, model, type, year, seats, gear, color, price, description, image) VALUES
('Audi', 'A6', 'Sedan', 2025, 5, 'Automatic', 'Black', '$280/day', 'Sophisticated luxury sedan with advanced technology and superior comfort', '/images/audi_a6.jfif'),
('Audi', 'Q7', 'SUV', 2025, 7, 'Automatic', 'Silver', '$320/day', 'Premium SUV with spacious interior and powerful performance', '/images/audi_q7.jfif'),
('Audi', 'R8', 'Sports Car', 2024, 2, 'Automatic', 'Red', '$450/day', 'High-performance supercar with breathtaking speed and precision', '/images/audi_r8.jpg'),
('BMW', '330i', 'Sedan', 2025, 5, 'Automatic', 'Blue', '$290/day', 'Dynamic sedan combining luxury with exceptional driving dynamics', '/images/bmw_330i.jfif'),
('BMW', 'M4', 'Sports Car', 2024, 4, 'Manual', 'White', '$420/day', 'Ultimate driving machine with raw power and precision handling', '/images/bmw_m4.jfif'),
('BMW', 'M8', 'Sports Car', 2024, 4, 'Automatic', 'Black', '$480/day', 'High-performance luxury coupe with unmatched acceleration', '/images/bmw_m8.jpg'),
('BMW', 'X5', 'SUV', 2025, 5, 'Automatic', 'Gray', '$340/day', 'Versatile luxury SUV offering comfort and capability', '/images/bmw_x5.jfif'),
('Lamborghini', 'Huracan', 'Sports Car', 2024, 2, 'Automatic', 'Green', '$650/day', 'Italian supercar masterpiece with unparalleled performance', '/images/lamborghini_huracan.jpeg'),
('Lamborghini', 'Revuelto', 'Sports Car', 2024, 2, 'Automatic', 'Yellow', '$750/day', 'Revolutionary hybrid supercar pushing boundaries of performance', '/images/lamborghini_revuelto.jfif'),
('Lamborghini', 'Urus', 'SUV', 2025, 5, 'Automatic', 'Orange', '$580/day', 'Super SUV combining Lamborghini DNA with everyday usability', '/images/lamborghini_urus.jfif'),
('Mercedes-Benz', 'C-Class', 'Sedan', 2025, 5, 'Automatic', 'Silver', '$310/day', 'Refined luxury sedan with cutting-edge technology and comfort', '/images/mercedes_c_class.jpg'),
('Mercedes-Benz', 'AMG GT', 'Sports Car', 2024, 2, 'Automatic', 'Black', '$520/day', 'Handcrafted AMG performance with pure driving emotion', '/images/mercedes_amg_gt.jpg'),
('Mercedes-Benz', 'GLE 600', 'SUV', 2025, 7, 'Automatic', 'White', '$450/day', 'Flagship SUV with ultimate luxury and advanced features', '/images/merceds_gle_600.jfif'),
('Mercedes-Benz', 'SL680', 'Convertible', 2024, 2, 'Automatic', 'Red', '$380/day', 'Iconic roadster combining tradition with modern luxury', '/images/mercedes_sl680.jfif'),
('Porsche', '911 GTS', 'Sports Car', 2024, 4, 'Manual', 'Blue', '$550/day', 'Legendary sports car with unmatched handling and performance', '/images/porsche_911_gts.jfif'),
('Porsche', 'Cayenne', 'SUV', 2025, 5, 'Automatic', 'Black', '$420/day', 'High-performance SUV with Porsche engineering excellence', '/images/porsche_cayenne.jpg'),
('Porsche', 'GT3 RS', 'Sports Car', 2024, 2, 'Manual', 'Silver', '$680/day', 'Track-focused supercar with racing pedigree', '/images/porsche_gt3rs.jpg'),
('Tesla', 'Model 3', 'Sedan', 2025, 5, 'Automatic', 'Pearl White', '$180/day', 'Electric sedan with autopilot and sustainable performance', '/images/tesla_model_3.jfif'),
('Tesla', 'Model S', 'Sedan', 2025, 5, 'Automatic', 'Midnight Silver', '$220/day', 'Luxury electric sedan with exceptional range and technology', '/images/tesla_model_s.jfif'),
('Tesla', 'Model X', 'SUV', 2025, 7, 'Automatic', 'Deep Blue', '$250/day', 'Electric SUV with falcon wing doors and premium features', '/images/tesla_model_x.jfif'),
('Tesla', 'Roadster', 'Sports Car', 2025, 4, 'Automatic', 'Red', '$350/day', 'Next-generation electric supercar with unmatched acceleration', '/images/tesla_roadster.jpg');