export default function Header({ active, setActive }) {
  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Futsal Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setActive("dashboard")}
                className={`transition-colors ${
                  active === "dashboard"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActive("booking")}
                className={`transition-colors ${
                  active === "booking"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActive("addGround")}
                className={`transition-colors ${
                  active === "addGround"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Add ground
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
