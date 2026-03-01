import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

const motivationQuotes = [
  "Great job! You're getting closer to your goal! 🔥",
  "Every rupee counts towards your big dream! 💰",
  "Consistency is the key to wealth! Keep going! 🚀",
  "Small steps lead to big results. Stay focused! ✨",
  "Your future self will thank you for saving today! 🌳",
  "Dream big, save smart! You've got this! 🎯"
];

function App() {
  const [goals, setGoals] = useState([]); 
  const [activeGoalIndex, setActiveGoalIndex] = useState(null);
  const [page, setPage] = useState(2); 
  
  
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingsInput, setSavingsInput] = useState('');
  
  const [isFlying, setIsFlying] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  // Confetti trigger reached 1000
  useEffect(() => {
    if (activeGoalIndex !== null && goals[activeGoalIndex]?.saved >= 1000) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b894', '#55efc4', '#ffeaa7']
      });
    }
  }, [activeGoalIndex !== null && goals[activeGoalIndex]?.saved]);

  const handleCreateGoal = () => {
    if (goalName && targetAmount > 0) {
      const newGoal = {
        name: goalName,
        target: Number(targetAmount),
        saved: 0
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      setActiveGoalIndex(updatedGoals.length - 1); // Switch to the new goal
      setGoalName('');
      setTargetAmount('');
      setPage(1); 
    } else {
      alert("Please enter Goal and Target Amount!");
    }
  };

  const handleAddSavings = () => {
    if (!savingsInput || savingsInput <= 0) return;
    setIsFlying(true);
    
    
    const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    
    setTimeout(() => {
      const updatedGoals = [...goals];
      updatedGoals[activeGoalIndex].saved += Number(savingsInput);
      setGoals(updatedGoals);
      setCurrentQuote(randomQuote) ;
      setSavingsInput('');
      setIsFlying(false);
    }, 800);
  };

  const deleteGoal = (indexToDelete) => {
  if (window.confirm("Are you sure you want to delete this goal?")) {
    const updatedGoals = goals.filter((_, index) => index !== indexToDelete);
    setGoals(updatedGoals);

    if (updatedGoals.length === 0) {
      setPage(2);
      setActiveGoalIndex(null);
    } else {
      setActiveGoalIndex(0);
    }
  }
};

  const activeGoal = goals[activeGoalIndex];

  return (
    <div className="app-wrapper">
      <AnimatePresence mode="wait">
        {page === 2 ? (
          <motion.div key="setGoal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="container">
            <h1 className="main-title">💰 Finance Tracker 🎯</h1>
            <h2 className="sub-title">{goals.length > 0 ? "Add Another Goal" : "Set Your New Goal"}</h2>
            <div className="input-group">
              <input type="text" placeholder="Goal (e.g. New Bike)" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
              <input type="number" placeholder="Target Amount (₹)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            </div>
            <button className="btn-add" onClick={handleCreateGoal}>
              {goals.length > 0 ? "Add This Goal 🚀" : "Create Goal 🚀"}
            </button>
            {goals.length > 0 && (
              <button className="btn-back-link" onClick={() => setPage(1)}>Cancel & Back</button>
            )}
          </motion.div>
        ) : (
          <motion.div key="tracker" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="container">
            <h1 className="main-title">💰 Finance Tracker 🎯</h1>

            {/* GOAL TABS: Switch goals here */}
            <div className="goal-tabs">
              {goals.map((g, index) => (
                <button 
                  key={index} 
                  className={`tab-btn ${activeGoalIndex === index ? 'active' : ''}`}
                  onClick={() => { setActiveGoalIndex(index); setCurrentQuote(''); }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {currentQuote && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="quote-box">
                  "{currentQuote}"
                </motion.div>
              )}
            </AnimatePresence>

            <div className="goal-box">
               Track: {activeGoal?.name} <span>{activeGoal?.name.toLowerCase().includes('bike') ? '🏍️' : '🏁'}</span>
            </div>

            <div className="stats">
              <span>Saved: <b>₹{activeGoal?.saved}</b></span>
              <span>Target: <b>₹{activeGoal?.target}</b></span>
            </div>

            <div className="progress-bg">
              <div className="progress-bar" style={{ width: `${Math.min((activeGoal?.saved / activeGoal?.target) * 100, 100)}%` }}></div>
            </div>

            <div className="input-area">
              <input type="number" placeholder="Enter amount saved" value={savingsInput} onChange={(e) => setSavingsInput(e.target.value)} />
              {isFlying && <motion.div initial={{ y: 0 }} animate={{ y: -300, x: 100, opacity: 0 }} className="money-icon">💸</motion.div>}
            </div>

            <button className="btn-add" onClick={handleAddSavings}>Add Savings +</button>
            <button className="btn-delete" onClick={() => deleteGoal(activeGoalIndex)}>🗑️ Delete Current Goal</button>
            
            {/* set a new goal*/}
            <button className="btn-new-outline" onClick={() => setPage(2)}>
              ➕ Add Another New Goal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
