import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";
import CodeRain from "@/components/CodeRain";

interface MatchWithNames {
  id: string;
  p1_name: string;
  p2_name: string;
  score: number;
  title: string;
}

const Reveal = () => {
  const [matches, setMatches] = useState<MatchWithNames[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data: matchData } = await supabase
      .from("matches")
      .select("*")
      .order("score", { ascending: false });

    if (!matchData || matchData.length === 0) {
      setLoading(false);
      return;
    }

    const pIds = [...new Set(matchData.flatMap((m) => [m.p1_id, m.p2_id]))];
    const { data: participants } = await supabase
      .from("participants")
      .select("id, name")
      .in("id", pIds);

    const nameMap = Object.fromEntries((participants || []).map((p) => [p.id, p.name]));

    setMatches(
      matchData.map((m) => ({
        id: m.id,
        p1_name: nameMap[m.p1_id] || "???",
        p2_name: nameMap[m.p2_id] || "???",
        score: Number(m.score),
        title: m.title,
      }))
    );
    setLoading(false);
  };

  const current = currentIndex >= 0 && currentIndex < matches.length ? matches[currentIndex] : null;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <FloatingHearts />
      <CodeRain />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Heart className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <p className="text-xl font-display text-foreground mt-4">Loading matches...</p>
            </motion.div>
          )}

          {!loading && matches.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Heart className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">No Matches Yet</h2>
              <p className="text-muted-foreground">Ask the admin to run the matching algorithm first!</p>
            </motion.div>
          )}

          {!loading && currentIndex === -1 && matches.length > 0 && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Heart className="w-24 h-24 text-primary mx-auto mb-6" fill="currentColor" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-gradient glow-text mb-4">
                MatchMatrix
              </h1>
              <p className="text-2xl text-muted-foreground mb-2">Valentine Event Edition</p>
              <p className="text-lg text-muted-foreground mb-10">
                {matches.length} matches ready to reveal!
              </p>
              <Button
                onClick={() => setCurrentIndex(0)}
                size="lg"
                className="bg-gradient-romance text-primary-foreground font-display text-xl px-12 py-8 shadow-neon-strong animate-pulse-glow"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Reveal First Match
              </Button>
            </motion.div>
          )}

          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-center"
            >
              {/* Title badge */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block bg-primary/20 border border-primary/40 rounded-full px-6 py-2 mb-8"
              >
                <span className="text-primary font-display text-lg">{current.title}</span>
              </motion.div>

              {/* Names */}
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-card border border-border rounded-2xl p-6 md:p-10 min-w-[150px] md:min-w-[250px] shadow-neon"
                >
                  <p className="text-3xl md:text-5xl font-display font-black text-foreground">
                    {current.p1_name}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-primary animate-heart-beat" fill="currentColor" />
                </motion.div>

                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-card border border-border rounded-2xl p-6 md:p-10 min-w-[150px] md:min-w-[250px] shadow-neon"
                >
                  <p className="text-3xl md:text-5xl font-display font-black text-foreground">
                    {current.p2_name}
                  </p>
                </motion.div>
              </div>

              {/* Score */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="mb-10"
              >
                <p className="text-6xl md:text-8xl font-display font-black text-gradient glow-text">
                  {current.score}%
                </p>
                <p className="text-lg text-muted-foreground mt-2">Compatibility Score</p>
              </motion.div>

              {/* Counter and Next */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-muted-foreground font-body">
                  {currentIndex + 1} / {matches.length}
                </span>
                {currentIndex < matches.length - 1 ? (
                  <Button
                    onClick={() => setCurrentIndex((p) => p + 1)}
                    size="lg"
                    className="bg-gradient-romance text-primary-foreground font-display text-lg px-8 py-6 shadow-neon"
                  >
                    Next Pair <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <div className="text-primary font-display text-lg">🎉 All matches revealed!</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reveal;
