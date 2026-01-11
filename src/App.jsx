import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sun, 
  Moon, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  ListTodo, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2 
} from 'lucide-react';

// --- Sub-Components ---

// 1. Header Component
const Header = ({ darkMode, setDarkMode }) => (
  <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-600 rounded-lg text-white">
        <LayoutDashboard size={24} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">FocusBoard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your workflow</p>
      </div>
    </div>
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
      title="Toggle Theme"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </header>
);

// 2. Timer Component (Pomodoro)
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
        <Timer size={20} />
        <h2 className="font-semibold uppercase tracking-wider text-sm">Focus Timer</h2>
      </div>
      
      <div className="text-center py-6">
        <div className="text-6xl font-mono font-bold text-gray-800 dark:text-white mb-2">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
          {mode === 'focus' ? 'Focus Time' : 'Short Break'}
        </p>
        
        <div className="flex justify-center gap-3">
          <button 
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button 
            onClick={resetTimer}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Todo List Component
const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review React components", completed: true },
    { id: 2, text: "Write documentation", completed: false },
    { id: 3, text: "Deploy to production", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 h-full flex flex-col">
      <div className="flex justify-between items-end mb-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <ListTodo size={20} />
          <h2 className="font-semibold uppercase tracking-wider text-sm">Tasks</h2>
        </div>
        <span className="text-xs font-medium text-gray-400">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-6">
        <div 
          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <form onSubmit={addTask} className="relative mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      <ul className="space-y-3 overflow-y-auto flex-1 max-h-[300px] custom-scrollbar">
        {tasks.length === 0 && (
          <li className="text-center text-gray-400 dark:text-gray-600 py-8 text-sm italic">
            No tasks yet. Stay focused!
          </li>
        )}
        {tasks.map(task => (
          <li 
            key={task.id} 
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-indigo-500'}`}
              >
                {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              <span className={`truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                {task.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // This logic handles the dark mode class on the HTML element
    // ensuring it works with Tailwind's dark mode strategy
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900');
      document.body.classList.remove('bg-gray-50');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-gray-50');
      document.body.classList.remove('bg-gray-900');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark text-white' : ''}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Timer & Stats */}
          <div className="space-y-6">
            <PomodoroTimer />
            
            {/* Simple Stat Widget */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="font-semibold text-lg mb-1">Weekly Insight</h3>
              <p className="text-indigo-100 text-sm mb-4">You are most productive on Tuesday mornings.</p>
              <div className="flex gap-2 text-xs font-mono opacity-80">
                <span className="bg-white/20 px-2 py-1 rounded">Focus: 85%</span>
                <span className="bg-white/20 px-2 py-1 rounded">Tasks: 12</span>
              </div>
            </div>
          </div>

          {/* Right Column: Todo List */}
          <div className="h-full">
            <TodoList />
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          Built with React & Tailwind CSS
        </div>
      </div>
    </div>
  );
}
