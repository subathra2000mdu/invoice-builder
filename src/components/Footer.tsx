const Footer = () => {
  return (
    <footer className="mt-auto bg-[#f5f5f5] border-t border-gray-100 p-6 md:px-12 lg:px-24">
         <div className="bg-gray-800 text-white text-center py-4 mt-8 text-sm sm:text-base">
        © {new Date().getFullYear()} InvoiceBuilder. All Rights Reserved.
      </div>
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-10">
                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-gray-700 text-sm tracking-wider uppercase">
                        Terms & Conditions
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Please pay within 15 days of issue.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Interest of 1.5% charged on late payments.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-gray-700 text-sm tracking-wider uppercase">
                        Contact Support
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Email: <a href="mailto:support@invoicebuilder.com" className="text-cyan-600 font-medium hover:underline">
                            support@invoicebuilder.com
                        </a>
                    </p>
                    <p className="text-gray-600 text-sm">
                        Phone: <span className="text-gray-700">+1 (555) 0123-456</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 text-[11px] text-gray-400 border-t border-gray-200 pt-6">
                <p>© 2026 Invoice Builder. All rights reserved.</p>
                <p className="text-cyan-600 italic font-medium">Thank you for your business!</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer;
