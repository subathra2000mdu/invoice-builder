import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">

            
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Welcome to InvoiceBuilder!
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Create your invoice.
            </p>
          </div>

          <button  onClick={() => window.location.href = '/add'} className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg shadow-md transition">
            Get Started - Create Your Invoice
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mt-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
            The Easiest Way to Invoice - Start Here.
          </h3>

          <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
            <li>
              📝 <span className="font-semibold">No Sign-up Required:</span>{" "}
              Instantly create invoices without an account.
            </li>
            <li>
              📦 <span className="font-semibold">Easily Add Entries:</span>{" "}
              Instantly list and describe your products or services.
            </li>
            <li>
              🧮 <span className="font-semibold">Automatic Calculations:</span>{" "}
              Totals, tax, and amounts are computed in real-time.
            </li>
            <li>
              📄 <span className="font-semibold">Professional Layout:</span>{" "}
              Ensure a modern and clear look for your clients.
            </li>
          </ul>

          <p className="text-gray-600 mt-6 text-sm sm:text-base">
            InvoiceBuilder is designed for simplicity and speed. No downloads
            or complicated setups. Just fill in your details and send.
          </p>
        </div>

        
        <div className="bg-blue-50 rounded-xl shadow-md p-5 sm:p-6 mt-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Process Overview
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Step Process (Preview Only)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            
            <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition text-center">
              <div className="text-4xl mb-4">👤</div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                1. Add Business & Client Details
              </h4>
              <p className="text-gray-600 text-sm">
                Enter your info and the client's information once.
              </p>
            </div>

            
            <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                2. Add Your Items
              </h4>
              <p className="text-gray-600 text-sm">
                Easily list products and services with quantities and rates.
              </p>
            </div>

            
            <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                3. Review & Send
              </h4>
              <p className="text-gray-600 text-sm">
                Get instant preview and download or email your invoice.
              </p>
            </div>

          </div>
        </div>

      </div>

      
    </div>
  );
};

export default Home;