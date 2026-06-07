import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
  selectCount,
} from "./features/counter/counterSlice";

function App() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Glass card */}
      <div className="w-full max-w-md bg-surface-2/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <h1 className="text-text-primary text-lg font-medium tracking-tight">
            AlphaGrid
          </h1>
        </div>

        {/* Counter display */}
        <div className="bg-surface-3/60 border border-border rounded-xl px-6 py-10 mb-6 text-center">
          <span className="text-6xl font-mono font-light text-text-primary tabular-nums">
            {count}
          </span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => dispatch(decrement())}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface-3/50 text-text-secondary text-sm font-medium transition-all duration-150 hover:bg-surface-hover hover:border-border-light hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-[0.98]"
          >
            − Decrement
          </button>
          <button
            onClick={() => dispatch(increment())}
            className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium transition-all duration-150 hover:bg-accent/20 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-[0.98]"
          >
            + Increment
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => dispatch(incrementByAmount(5))}
            className="px-4 py-2 rounded-xl border border-border bg-surface-3/30 text-text-tertiary text-sm transition-all duration-150 hover:bg-surface-hover hover:text-text-secondary hover:border-border-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 active:scale-[0.98]"
          >
            +5
          </button>
          <button
            onClick={() => dispatch(reset())}
            className="px-4 py-2 rounded-xl border border-border bg-surface-3/30 text-text-tertiary text-sm transition-all duration-150 hover:bg-surface-hover hover:text-text-secondary hover:border-border-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 active:scale-[0.98]"
          >
            Reset
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-text-tertiary text-xs text-center border-t border-border pt-4 mt-2">
          Redux Toolkit + Tailwind CSS v4 · Linear-inspired dark UI
        </p>
      </div>
    </div>
  );
}

export default App;
