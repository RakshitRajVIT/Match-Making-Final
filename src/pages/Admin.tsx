import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Users, Play, Trash2, Download, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";

const ADMIN_PASSWORD = "matchmatrix2025";

interface Participant {
  id: string;
  name: string;
  created_at: string;
}

interface Match {
  id: string;
  p1_id: string;
  p2_id: string;
  score: number;
  title: string;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const fetchData = async () => {
    const [pRes, mRes] = await Promise.all([
      supabase.from("participants").select("*").order("created_at", { ascending: false }),
      supabase.from("matches").select("*").order("score", { ascending: false }),
    ]);
    if (pRes.data) setParticipants(pRes.data);
    if (mRes.data) setMatches(mRes.data);
  };

  const runMatching = async () => {
    setLoading(true);
    try {
      const { data: allParticipants } = await supabase.from("participants").select("id");
      const { data: allResponses } = await supabase.from("responses").select("*");

      if (!allParticipants || !allResponses || allParticipants.length < 2) {
        toast({ title: "Need at least 2 participants", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Build trait profiles
      const profiles: Record<string, Record<string, string[]>> = {};
      for (const r of allResponses) {
        if (!profiles[r.participant_id]) profiles[r.participant_id] = {};
        if (!profiles[r.participant_id][r.trait]) profiles[r.participant_id][r.trait] = [];
        profiles[r.participant_id][r.trait].push(r.value);
      }

      // Compute trait match
      const traitMatch = (a: string[], b: string[]) => {
        if (!a || !b || a.length === 0 || b.length === 0) return 0;
        let matches = 0;
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (a[i] === b[i]) matches++;
        }
        return matches / Math.max(a.length, b.length);
      };

      // Compute all pair scores
      const ids = allParticipants.map((p) => p.id);
      const pairs: { p1: string; p2: string; score: number }[] = [];

      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const a = profiles[ids[i]] || {};
          const b = profiles[ids[j]] || {};
          const score =
            0.35 * traitMatch(a.personality || [], b.personality || []) +
            0.25 * traitMatch(a.love_language || [], b.love_language || []) +
            0.20 * traitMatch(a.interests || [], b.interests || []) +
            0.20 * traitMatch(a.tech_role || [], b.tech_role || []);
          pairs.push({ p1: ids[i], p2: ids[j], score: Math.round(score * 100) });
        }
      }

      // Greedy matching
      pairs.sort((a, b) => b.score - a.score);
      const used = new Set<string>();
      const finalPairs: typeof pairs = [];

      for (const pair of pairs) {
        if (!used.has(pair.p1) && !used.has(pair.p2)) {
          used.add(pair.p1);
          used.add(pair.p2);
          finalPairs.push(pair);
        }
      }

      // Clear old matches and insert new
      await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const titles = [
        "Perfect Debugging Duo 🐛", "Merge Conflict Soulmates 💕",
        "Co-founders in Love 🚀", "404: Loneliness Not Found 💘",
        "Git Commit Partners 💝", "Pair Programming Sweethearts 👩‍💻❤️👨‍💻",
        "Stack Overflow Soulmates 📚", "Deploy Together Forever 🌐",
        "Infinite Loop of Love ♾️", "Best Branch Match 🌿",
      ];

      const matchInserts = finalPairs.map((p, i) => ({
        p1_id: p.p1,
        p2_id: p.p2,
        score: p.score,
        title: titles[i % titles.length],
      }));

      if (matchInserts.length > 0) {
        await supabase.from("matches").insert(matchInserts);
      }

      toast({ title: `${matchInserts.length} matches created!` });
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: "Matching failed", variant: "destructive" });
    }
    setLoading(false);
  };

  const resetMatches = async () => {
    await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    toast({ title: "Matches cleared" });
    fetchData();
  };

  const exportCSV = () => {
    const nameMap = Object.fromEntries(participants.map((p) => [p.id, p.name]));
    const rows = [["Person 1", "Person 2", "Score", "Title"]];
    for (const m of matches) {
      rows.push([nameMap[m.p1_id] || m.p1_id, nameMap[m.p2_id] || m.p2_id, String(m.score), m.title]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "matchmatrix_results.csv";
    a.click();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <FloatingHearts />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-8 max-w-sm w-full shadow-neon relative z-10"
        >
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-center mb-6 text-foreground">Admin Access</h2>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="mb-4 bg-muted border-border"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button onClick={handleLogin} className="w-full bg-gradient-romance text-primary-foreground">
            Unlock
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingHearts />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">MatchMatrix Control Center</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => { sessionStorage.removeItem("admin_auth"); setAuthenticated(false); }}
            className="text-muted-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <Users className="w-8 h-8 text-primary mb-2" />
            <p className="text-3xl font-display font-bold text-foreground">{participants.length}</p>
            <p className="text-sm text-muted-foreground">Participants</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <span className="text-3xl mb-2 block">💕</span>
            <p className="text-3xl font-display font-bold text-foreground">{matches.length}</p>
            <p className="text-sm text-muted-foreground">Matches</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center gap-3">
            <Button
              onClick={runMatching}
              disabled={loading}
              className="bg-gradient-romance text-primary-foreground shadow-neon"
            >
              <Play className="w-4 h-4 mr-2" /> {loading ? "Running..." : "Run Matching"}
            </Button>
            <div className="flex gap-2">
              <Button onClick={resetMatches} variant="outline" size="sm" className="flex-1 border-border text-foreground">
                <Trash2 className="w-3 h-3 mr-1" /> Reset
              </Button>
              <Button onClick={exportCSV} variant="outline" size="sm" className="flex-1 border-border text-foreground">
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Participants table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Participants</h3>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-muted-foreground font-body">Name</th>
                  <th className="text-left p-3 text-muted-foreground font-body">Joined</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr><td colSpan={2} className="p-4 text-center text-muted-foreground">No participants yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matches table */}
        {matches.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Matches</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-muted-foreground font-body">Person 1</th>
                    <th className="text-left p-3 text-muted-foreground font-body">Person 2</th>
                    <th className="text-left p-3 text-muted-foreground font-body">Score</th>
                    <th className="text-left p-3 text-muted-foreground font-body">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => {
                    const p1 = participants.find((p) => p.id === m.p1_id);
                    const p2 = participants.find((p) => p.id === m.p2_id);
                    return (
                      <tr key={m.id} className="border-t border-border">
                        <td className="p-3 text-foreground">{p1?.name || "?"}</td>
                        <td className="p-3 text-foreground">{p2?.name || "?"}</td>
                        <td className="p-3 text-primary font-bold">{m.score}%</td>
                        <td className="p-3 text-muted-foreground">{m.title}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
