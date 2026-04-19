import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Cpu, Activity, Database, AlertCircle } from 'lucide-react'
import './App.css'

const BOOT_LOGS = [
  "INITIALIZING PARADA_OS KERNEL V0.1.4...",
  "VERIFYING BARE_METAL INTEGRITY... [OK]",
  "LOADING CORE_RESILIENCE_DOJO MODULE... [OK]",
  "ATTACHING ZFS_POOL_ARCHIVE... [OK]",
  "SYNCHRONIZING PIXELS_AGENCY SIGNALS... [OK]",
  "FILTERING NOISE_RHETORIC... [ACTIVE]",
  "ESTABLISHING THE_QUIET... [STABLE]",
  "WELCOME, GUEST. SYSTEM IS IN READ_ONLY MODE."
]

const SYSCALL_RESPONSES: Record<string, string> = {
  "help": "AVAILABLE_SYSCALLS: affirm(), uplift(), zpool_status(), reparent(), whoami, clear",
  "whoami": "GUEST@PARADA.INFO // ROLE: OBSERVER // STATUS: UNPRIVILEGED",
  "zpool_status()": "NAME: ARCHIVE_01 | STATE: ONLINE | READ: 0 | WRITE: 0 | CKSUM: 0 | STATUS: Optimal resilience achieved.",
  "affirm()": "SIGNAL_VALIDATED: 'I am enough.' Boundary integrity at 100%.",
  "uplift()": "PROTOCOL: KARATE_AND_HUGS initiated. Healing stray signals in proximity.",
  "reparent()": "REPARENTING_PROCESS: 0x88f2. Realigning signal with the core architect's intent.",
}

function App() {
  const [booting, setBooting] = useState(true)
  const [bootIndex, setBootIndex] = useState(0)
  const [history, setHistory] = useState<{type: 'cmd' | 'resp', text: string}[]>([])
  const [input, setInput] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bootIndex < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        setBootIndex(prev => prev + 1)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => setBooting(false), 500)
    }
  }, [bootIndex])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, booting])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const cmd = input.trim().toLowerCase()
    const newHistory = [...history, { type: 'cmd' as const, text: `guest@parada.info:~$ ${input}` }]
    
    if (cmd === 'clear') {
      setHistory([])
    } else if (SYSCALL_RESPONSES[cmd]) {
      newHistory.push({ type: 'resp' as const, text: SYSCALL_RESPONSES[cmd] })
      setHistory(newHistory)
    } else if (cmd.includes('(')) {
       // Handle function-style syscalls specifically
       const baseCmd = cmd.split('(')[0] + '()'
       if (SYSCALL_RESPONSES[baseCmd]) {
         newHistory.push({ type: 'resp' as const, text: SYSCALL_RESPONSES[baseCmd] })
       } else {
         newHistory.push({ type: 'resp' as const, text: `p_syscall: ${cmd}: symbol not found` })
       }
       setHistory(newHistory)
    } else {
      newHistory.push({ type: 'resp' as const, text: `sh: command not found: ${cmd}. Type 'help' for syscalls.` })
      setHistory(newHistory)
    }

    setInput('')
  }

  return (
    <div className="info-container">
      <div className="terminal-window">
        <header className="terminal-header">
           <div className="header-left">
              <Cpu size={14} /> <span>PARADA_OS_CORE</span>
           </div>
           <div className="header-right">
              SESSION: GUEST_BUNKER
           </div>
        </header>

        <main className="terminal-body">
          {/* BOOT SEQUENCE */}
          {BOOT_LOGS.slice(0, bootIndex).map((log, i) => (
            <div key={i} className="log-line boot">{log}</div>
          ))}

          {!booting && (
            <>
              <AnimatePresence>
                {history.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={`log-line ${item.type}`}
                  >
                    {item.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              <form onSubmit={handleCommand} className="input-line">
                <span className="prompt">guest@parada.info:~$</span>
                <input 
                  type="text" 
                  autoFocus 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  spellCheck="false"
                  autoComplete="off"
                />
              </form>
            </>
          )}
          <div ref={terminalEndRef} />
        </main>
      </div>

      <aside className="system-status">
         <div className="status-item">
            <Activity size={16} />
            <label>CPU_LOAD</label>
            <div className="bar"><div className="fill" style={{width: '12%'}}></div></div>
         </div>
         <div className="status-item">
            <Database size={16} />
            <label>ZPOOL_HEALTH</label>
            <div className="value">ONLINE</div>
         </div>
         <div className="status-item">
            <Shield size={16} />
            <label>NOISE_FILTER</label>
            <div className="value">ACTIVE</div>
         </div>
         <div className="panic-indicator">
            <AlertCircle size={20} />
            <span>NO KERNEL PANIC DETECTED</span>
         </div>
      </aside>

      <div className="crt-overlay"></div>
    </div>
  )
}

export default App
