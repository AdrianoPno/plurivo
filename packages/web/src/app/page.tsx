"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Redirecionando para o login...</h1>
    </div>
  );
}
