import { useEffect, useState } from "react";

function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const cleanNumber = (value) => {
    return value.replace(/,/g, "");
  };

  const formatNumber = (number) => {
    if (!Number.isFinite(number)) {
      return "Error";
    }

    const rounded = Number.parseFloat(Number(number).toFixed(10));

    return rounded.toLocaleString("en-US", {
      maximumFractionDigits: 10,
    });
  };

  const inputNumber = (number) => {
    setError("");

    if (waitingForOperand) {
      setDisplay(number);
      setWaitingForOperand(false);
      return;
    }

    if (display === "0") {
      setDisplay(number);
      return;
    }

    if (cleanNumber(display).length < 15) {
      setDisplay(display + number);
    }
  };

  const inputDecimal = () => {
    setError("");

    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!cleanNumber(display).includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearCalculator = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setError("");
  };

  const deleteLast = () => {
    setError("");

    if (waitingForOperand) {
      return;
    }

    const current = cleanNumber(display);

    if (current.length <= 1) {
      setDisplay("0");
      return;
    }

    setDisplay(current.slice(0, -1));
  };

  const calculate = (first, second, selectedOperator) => {
    switch (selectedOperator) {
      case "+":
        return first + second;

      case "-":
        return first - second;

      case "×":
        return first * second;

      case "÷":
        if (second === 0) {
          return null;
        }
        return first / second;

      default:
        return second;
    }
  };

  const chooseOperator = (selectedOperator) => {
    setError("");

    const inputValue = Number(cleanNumber(display));

    if (Number.isNaN(inputValue)) {
      return;
    }

    if (
      operator &&
      previousValue !== null &&
      !waitingForOperand
    ) {
      const result = calculate(
        previousValue,
        inputValue,
        operator
      );

      if (result === null) {
        setDisplay("Error");
        setError("Cannot divide by zero.");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(formatNumber(result));
      setPreviousValue(result);
      setOperator(selectedOperator);
      setWaitingForOperand(true);
      return;
    }

    setPreviousValue(inputValue);
    setOperator(selectedOperator);
    setWaitingForOperand(true);
  };

  const performCalculation = () => {
    if (operator === null || previousValue === null) {
      return;
    }

    const currentValue = Number(cleanNumber(display));

    if (Number.isNaN(currentValue)) {
      return;
    }

    const result = calculate(
      previousValue,
      currentValue,
      operator
    );

    if (result === null) {
      setDisplay("Error");
      setError("Cannot divide by zero.");

      setHistory((oldHistory) => [
        `${formatNumber(previousValue)} ${operator} ${formatNumber(
          currentValue
        )} = Error`,
        ...oldHistory,
      ].slice(0, 5));

      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return;
    }

    const formattedResult = formatNumber(result);

    setHistory((oldHistory) => [
      `${formatNumber(previousValue)} ${operator} ${formatNumber(
        currentValue
      )} = ${formattedResult}`,
      ...oldHistory,
    ].slice(0, 5));

    setDisplay(formattedResult);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleButton = (value) => {
    if (value >= "0" && value <= "9") {
      inputNumber(value);
      return;
    }

    if (value === ".") {
      inputDecimal();
      return;
    }

    if (["+", "-", "×", "÷"].includes(value)) {
      chooseOperator(value);
      return;
    }

    if (value === "=") {
      performCalculation();
      return;
    }

    if (value === "AC") {
      clearCalculator();
      return;
    }

    if (value === "DEL") {
      deleteLast();
    }
  };

  useEffect(() => {
    const handleKeyboard = (event) => {
      const key = event.key;

      if (key >= "0" && key <= "9") {
        inputNumber(key);
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "+") {
        chooseOperator("+");
      } else if (key === "-") {
        chooseOperator("-");
      } else if (key === "*") {
        chooseOperator("×");
      } else if (key === "/") {
        chooseOperator("÷");
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        performCalculation();
      } else if (key === "Escape") {
        clearCalculator();
      } else if (key === "Backspace") {
        deleteLast();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  });

  const buttonClass =
    "h-16 rounded-2xl text-xl font-bold transition-all duration-150 active:scale-95";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            Lising<span className="text-blue-500">.</span>
          </h1>

          <div className="flex gap-6 text-sm text-slate-400">
            <a
              href="#calculator"
              className="hover:text-white"
            >
              Calculator
            </a>

            <a
              href="#guide"
              className="hover:text-white"
            >
              User Guide
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="px-6 py-12 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
                DCIT 26 • Laboratory 1
              </span>

              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                Simple.
                <span className="text-blue-500">
                  {" "}Smart.
                </span>
                <br />
                Calculator.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                A responsive calculator built with React,
                Tailwind CSS, React State, and Event Handling.
              </p>

              <div className="mt-8 flex gap-3">
                <a
                  href="#calculator"
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Try Calculator
                </a>

                <a
                  href="#guide"
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  User Guide
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Feature
                  title="React"
                  text="Components"
                />

                <Feature
                  title="Tailwind"
                  text="Responsive"
                />

                <Feature
                  title="State"
                  text="Dynamic"
                />

                <Feature
                  title="Events"
                  text="Interactive"
                />
              </div>
            </div>

            {/* Calculator */}
            <div id="calculator">
              <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                      DCIT 26
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Calculator
                    </h3>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Display */}
                <div className="p-6">
                  <div className="mb-5 min-h-32 rounded-2xl bg-slate-950 p-5 text-right">
                    <div className="min-h-6 text-sm text-slate-500">
                      {previousValue !== null && operator
                        ? `${formatNumber(previousValue)} ${operator}`
                        : "\u00A0"}
                    </div>

                    <div
                      className={`mt-3 overflow-x-auto whitespace-nowrap text-4xl font-bold sm:text-5xl ${
                        error
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {display}
                    </div>

                    {error && (
                      <p className="mt-2 text-xs text-red-400">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-4 gap-3">
                    <button
                      onClick={() => handleButton("AC")}
                      className={`${buttonClass} bg-slate-500 hover:bg-slate-400`}
                    >
                      AC
                    </button>

                    <button
                      onClick={() => handleButton("DEL")}
                      className={`${buttonClass} bg-slate-500 hover:bg-slate-400`}
                    >
                      DEL
                    </button>

                    <button
                      onClick={() => handleButton(".")}
                      className={`${buttonClass} bg-slate-700 hover:bg-slate-600`}
                    >
                      .
                    </button>

                    <button
                      onClick={() => handleButton("÷")}
                      className={`${buttonClass} bg-blue-600 hover:bg-blue-500`}
                    >
                      ÷
                    </button>

                    <NumberButton
                      number="7"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="8"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="9"
                      onClick={handleButton}
                    />

                    <OperatorButton
                      operator="×"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="4"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="5"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="6"
                      onClick={handleButton}
                    />

                    <OperatorButton
                      operator="-"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="1"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="2"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="3"
                      onClick={handleButton}
                    />

                    <OperatorButton
                      operator="+"
                      onClick={handleButton}
                    />

                    <NumberButton
                      number="0"
                      onClick={handleButton}
                      wide
                    />

                    <button
                      onClick={() => handleButton("=")}
                      className={`${buttonClass} bg-emerald-500 hover:bg-emerald-400`}
                    >
                      =
                    </button>
                  </div>
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">
                      Recent Calculations
                    </h3>

                    <button
                      onClick={() => setHistory([])}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* User Guide */}
        <section
          id="guide"
          className="border-t border-slate-800 px-6 py-16"
        >
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 sm:p-10">
              <p className="font-semibold uppercase tracking-widest text-blue-400">
                Instructions
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                User Guide
              </h2>

              <p className="mt-3 text-slate-400">
                Learn how to use the calculator and its
                supported features.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <GuideCard
                  number="1"
                  title="How to Use"
                >
                  <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-slate-400">
                    <li>Click a number from 0–9.</li>
                    <li>
                      Select +, −, ×, or ÷.
                    </li>
                    <li>Enter the second number.</li>
                    <li>Press = to calculate.</li>
                    <li>Press AC to reset.</li>
                  </ol>
                </GuideCard>

                <GuideCard
                  number="2"
                  title="Supported Operations"
                >
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      <b className="text-white">+</b>{" "}
                      Addition
                    </p>

                    <p>
                      <b className="text-white">−</b>{" "}
                      Subtraction
                    </p>

                    <p>
                      <b className="text-white">×</b>{" "}
                      Multiplication
                    </p>

                    <p>
                      <b className="text-white">÷</b>{" "}
                      Division
                    </p>

                    <p>
                      <b className="text-white">.</b>{" "}
                      Decimal numbers
                    </p>
                  </div>
                </GuideCard>

                <GuideCard
                  number="3"
                  title="Keyboard Support"
                >
                  <p className="text-sm leading-6 text-slate-400">
                    You can use your keyboard to enter numbers
                    and operations.
                  </p>

                  <p className="mt-3 text-sm text-slate-400">
                    <b className="text-white">
                      Enter
                    </b>{" "}
                    = Calculate
                  </p>

                  <p className="text-sm text-slate-400">
                    <b className="text-white">
                      Escape
                    </b>{" "}
                    = Clear
                  </p>

                  <p className="text-sm text-slate-400">
                    <b className="text-white">
                      Backspace
                    </b>{" "}
                    = Delete
                  </p>
                </GuideCard>

                <GuideCard
                  number="4"
                  title="Error Handling"
                >
                  <p className="text-sm leading-6 text-slate-400">
                    The calculator detects division by zero
                    and displays an error instead of crashing.
                  </p>

                  <div className="mt-4 rounded-xl bg-red-950/40 p-4 text-sm text-red-300">
                    Example: 10 ÷ 0 = Error
                  </div>
                </GuideCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center">
        <p className="font-semibold">
          Lising's React Calculator
        </p>

        <p className="mt-1 text-sm text-slate-500">
          DCIT 26 — Application Development and Emerging
          Technologies
        </p>
      </footer>
    </div>
  );
}

function NumberButton({ number, onClick, wide = false }) {
  return (
    <button
      onClick={() => onClick(number)}
      className={`h-16 rounded-2xl bg-slate-700 text-xl font-bold text-white transition-all hover:bg-slate-600 active:scale-95 ${
        wide ? "col-span-3" : ""
      }`}
    >
      {number}
    </button>
  );
}

function OperatorButton({ operator, onClick }) {
  return (
    <button
      onClick={() => onClick(operator)}
      className="h-16 rounded-2xl bg-blue-600 text-xl font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
    >
      {operator === "-" ? "−" : operator}
    </button>
  );
}

function Feature({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">
        {text}
      </p>
    </div>
  );
}

function GuideCard({ number, title, children }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
          {number}
        </div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

export default App;