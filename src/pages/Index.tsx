import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { quizQuestions } from "@/data/quizData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";
import CodeRain from "@/components/CodeRain";

type Phase = "landing" | "quiz" | "submitting" | "done";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("landing");
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const handleStart = () => {
    if (!consent) {
      toast({ title: "Please accept the consent disclaimer", variant: "destructive" });
      return;
    }
    setPhase("quiz");
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentQ < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQ((p) => p + 1), 300);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Please enter your name / nickname", variant: "destructive" });
      return;
    }
    if (Object.keys(answers).length < quizQuestions.length) {
      toast({ title: "Please answer all questions", variant: "destructive" });
      return;
    }

    setPhase("submitting");

    try {
      const { data: participant, error: pErr } = await supabase
        .from("participants")
        .insert({ name: name.trim() })
        .select("id")
        .single();

      if (pErr || !participant) throw pErr;

      const responsesData = quizQuestions.map((q) => ({
        participant_id: participant.id,
        question_id: q.id,
        trait: q.trait,
        value: answers[q.id],
      }));

      const { error: rErr } = await supabase.from("responses").insert(responsesData);
      if (rErr) throw rErr;

      setPhase("done");
    } catch (err) {
      console.error(err);
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
      setPhase("quiz");
    }
  };

  const progress = (Object.keys(answers).length / quizQuestions.length) * 100;
  const question = quizQuestions[currentQ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingHearts />
      <CodeRain />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* LANDING */}
          {phase === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center max-w-lg mx-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Heart className="w-16 h-16 text-primary" fill="currentColor" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-display font-bold mb-3 text-gradient glow-text">
                MatchMatrix
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-2 font-body">
                Valentine Event Edition
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Find your perfect match — powered by code & chemistry 💘
              </p>

              <div className="flex items-start gap-3 mb-8 text-left bg-card/50 border border-border rounded-lg p-4 backdrop-blur-sm">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(c) => setConsent(c === true)}
                  className="mt-1 border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I consent to sharing my quiz responses for matchmaking purposes at this event. 
                  No phone numbers or personal contact info will be collected.
                </Label>
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-romance text-primary-foreground font-display text-lg px-10 py-6 shadow-neon hover:shadow-neon-strong transition-shadow"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Start Quiz
              </Button>
            </motion.div>
          )}

          {/* QUIZ */}
          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl mx-auto"
            >
              {/* Name field */}
              {currentQ === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <Label className="text-foreground font-display text-sm mb-2 block">
                    Your Name / Nickname
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. CodeCrusher42"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    maxLength={50}
                  />
                </motion.div>
              )}

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2 font-body">
                  <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-romance rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl md:text-2xl font-display font-semibold mb-6 text-foreground">
                    {question.text}
                  </h2>

                  <div className="space-y-3">
                    {question.options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(question.id, opt.value)}
                        className={`w-full text-left p-4 rounded-lg border transition-all font-body ${
                          answers[question.id] === opt.value
                            ? "border-primary bg-primary/10 shadow-neon"
                            : "border-border bg-card/50 hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                  disabled={currentQ === 0}
                  className="text-muted-foreground"
                >
                  ← Back
                </Button>

                {currentQ < quizQuestions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQ((p) => p + 1)}
                    disabled={!answers[question.id]}
                    className="bg-gradient-romance text-primary-foreground"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < quizQuestions.length || !name.trim()}
                    className="bg-gradient-romance text-primary-foreground shadow-neon"
                  >
                    <Heart className="mr-2 w-4 h-4" /> Submit
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* SUBMITTING */}
          {phase === "submitting" && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Heart className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-lg text-foreground font-display">Submitting your vibes...</p>
            </motion.div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold mb-4 text-gradient">
                You're In! 💘
              </h2>
              <p className="text-muted-foreground mb-2">
                Thanks, <span className="text-foreground font-semibold">{name}</span>!
              </p>
              <p className="text-sm text-muted-foreground">
                Sit tight — your match will be revealed on the big screen soon. ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
