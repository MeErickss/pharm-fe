export function Parameters({ onClose }) {
    return (
      <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-red-700 p-4 rounded shadow-lg">
        <p className="text-white">Aba aberta!</p>
        <button className="mt-2 bg-white p-1 rounded" onClick={onClose}>Fechar</button>
      </div>
    );
  }
  