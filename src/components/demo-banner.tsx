export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return null;
  }

  return (
    <div className="bg-amber-600 px-4 py-2 text-center text-sm font-medium text-amber-50">
      Ambiente de demonstração — dados genéricos da Natcore. Não use para dados reais.
    </div>
  );
}
