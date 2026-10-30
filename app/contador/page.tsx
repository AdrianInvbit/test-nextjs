import type { Metadata } from "next";
import { Counter } from "@/components/Counter";

export const metadata: Metadata = {
  title: "Contador",
};

export default function CounterPage() {
  return <Counter />;
}
