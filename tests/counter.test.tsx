/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Counter } from "../components/Counter";

describe("contador cliente", () => {
  it("incrementa, decrementa y reinicia el valor con useState", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const value = screen.getByText("0", { selector: "#counter-value" });
    expect(value).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "Incrementar" }));
    await user.click(screen.getByRole("button", { name: "Incrementar" }));
    expect(value).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: "Decrementar" }));
    expect(value).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(value).toHaveTextContent("0");
  });
});
