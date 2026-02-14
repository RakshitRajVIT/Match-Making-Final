import { motion } from "framer-motion";

const CodeRain = () => {
  const codeSnippets = [
    "const love = true;",
    "if (match) { ❤️ }",
    "while(alive) love();",
    "return <Heart />;",
    "git commit -m '💕'",
    "npm i soulmate",
    "SELECT * FROM love;",
    "import { you } from 'my-heart';",
    "async function fall() {}",
    "// TODO: find match",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-primary/10 whitespace-nowrap"
          style={{ left: `${5 + i * 9}%`, top: "-5%" }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "linear",
          }}
        >
          {snippet}
        </motion.div>
      ))}
    </div>
  );
};

export default CodeRain;
