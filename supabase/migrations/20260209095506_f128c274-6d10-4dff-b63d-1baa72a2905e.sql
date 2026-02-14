
-- Participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Responses table
CREATE TABLE public.responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  trait TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  p1_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  p2_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  revealed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Participants: anyone can insert (quiz submission), select for admin/reveal
CREATE POLICY "Anyone can insert participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read participants" ON public.participants FOR SELECT USING (true);

-- Responses: anyone can insert, select for admin
CREATE POLICY "Anyone can insert responses" ON public.responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read responses" ON public.responses FOR SELECT USING (true);

-- Matches: anyone can read (for reveal), managed by edge function
CREATE POLICY "Anyone can read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Anyone can insert matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete matches" ON public.matches FOR DELETE USING (true);
CREATE POLICY "Anyone can update matches" ON public.matches FOR UPDATE USING (true);

-- Enable realtime for matches (for reveal screen)
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
