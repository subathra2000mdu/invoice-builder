
const Header = () => {
  return (
    <>
    <header className="bg-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📄 <span className="text-blue-700">Invoice</span>Builder
          </h1>
        </div>
        
      </header>

    {/* <header className="flex flex-wrap justify-between items-center px-4 md:px-8 py-4 border-b border-gray-100 bg-[#f5f5f5] gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center overflow-hidden">
                            <img src={invoiceLogo} alt="Invoice Builder Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-cyan-700 font-bold text-lg md:text-xl" style={{ fontFamily: 'ui-monospace' }}>
                            Invoice Builder
                        </h1>
                    </div>
                    <div className="text-cyan-700 font-medium text-sm md:text-lg" style={{ fontFamily: 'ui-monospace' }}>
                        Welcome Guest!
                    </div>
                </header> */}
                </>
  )
}

export default Header