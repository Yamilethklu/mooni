export default function N8NCanvas() {
  const nodes = ['Webhook', 'Google Routes', 'Tarifa', 'DB', 'Dispatch'];
  return (
    <div className="flex gap-4 p-8 bg-gray-900 rounded-lg">
      {nodes.map((node, i) => (
        <div key={i} className="p-4 border-2 border-emerald-500 bg-black rounded shadow-lg animate-pulse">
          {node}
        </div>
      ))}
    </div>
  );
}
