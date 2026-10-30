"use client";

import { useState } from "react";

export function Counter() {
  const [value, setValue] = useState(0);

  return (
    <section className="card" aria-labelledby="counter-title">
      <h2 id="counter-title">Contador</h2>
      <p className="counter-help">
        El valor se actualiza en el cliente con <code>useState</code>, sin
        recargar la página.
      </p>
      <p className="counter-value" id="counter-value" aria-live="polite">
        {value}
      </p>
      <div className="counter-actions">
        <button
          type="button"
          id="btn-decrement"
          onClick={() => setValue((current) => current - 1)}
        >
          Decrementar
        </button>
        <button
          type="button"
          id="btn-reset"
          className="button-secondary"
          onClick={() => setValue(0)}
        >
          Reiniciar
        </button>
        <button
          type="button"
          id="btn-increment"
          onClick={() => setValue((current) => current + 1)}
        >
          Incrementar
        </button>
      </div>
    </section>
  );
}
