import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface InvoiceItem {
    id: number;
    date: string;
    item: string;
    quantity: number;
    rate: number;
    tax: number;
    total: number;
}

const Add: React.FC = () => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [todayDate, setTodayDate] = useState("");
    

    const [formData, setFormData] = useState({
        name: '', invoiceNumber: '', phoneNumber: '',
        description: '',
        item: '', quantity: '', rate: '', taxPercent: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [submittedData, setSubmittedData] = useState<InvoiceItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const subtotal = submittedData.reduce((acc, current) => acc + (current.quantity * current.rate), 0);
    const totalTax = submittedData.reduce((acc, current) => acc + current.tax, 0);
    const grandTotal = subtotal + totalTax;

    const generateNewInvoice = () => {
        const now = new Date();
        const formatted = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        setTodayDate(formatted);
        setFormData({
            name: '', invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
            phoneNumber: '', description: '', item: '', quantity: '', rate: '', taxPercent: '',
        });
        setSubmittedData([]);
        setEditingId(null);
        setError(null);
    };

    useEffect(() => { generateNewInvoice(); }, []);

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all fields and the table?")) {
            generateNewInvoice();
        }
    };

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element || isGenerating) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const toHide = clonedDoc.querySelectorAll('.action-hide');
                    toHide.forEach((el) => (el as HTMLElement).style.display = 'none');

                    const container = clonedDoc.querySelector('.max-w-6xl');
                    if (container) {
                        const footerDiv = clonedDoc.createElement('div');
                        footerDiv.style.marginTop = "50px";
                        footerDiv.style.paddingTop = "30px";
                        footerDiv.style.borderTop = "1px solid #e5e7eb";
                        footerDiv.innerHTML = `
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-family: sans-serif;">
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <h3 style="font-weight: bold; color: #374151; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Terms & Conditions</h3>
                                    <p style="color: #4b5563; font-size: 11px; margin: 0;">Please pay within 15 days of issue.</p>
                                    <p style="color: #4b5563; font-size: 11px; margin: 0;">Interest of 1.5% charged on late payments.</p>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <h3 style="font-weight: bold; color: #374151; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Contact Support</h3>
                                    <p style="color: #4b5563; font-size: 11px; margin: 0;">Email: support@invoicebuilder.com</p>
                                    <p style="color: #4b5563; font-size: 11px; margin: 0;">Phone: +1 (555) 0123-456</p>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 15px; font-size: 10px; color: #9ca3af;">
                                <p>© 2026 Invoice Builder. All rights reserved.</p>
                                <p style="color: #0891b2; font-style: italic; font-weight: 600;">Thank you for your business!</p>
                            </div>
                        `;
                        container.appendChild(footerDiv);
                    }

                    const inputs = clonedDoc.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        const div = clonedDoc.createElement('div');
                        div.innerText = (input as HTMLInputElement | HTMLTextAreaElement).value;
                        div.style.cssText = window.getComputedStyle(input).cssText;
                        div.style.border = 'none';
                        div.style.backgroundColor = 'transparent';
                        div.style.whiteSpace = 'pre-wrap';
                        input.parentNode?.replaceChild(div, input);
                    });
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${formData.invoiceNumber}.pdf`);
        } catch (err) {
            console.error("PDF Export Error:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (['quantity', 'rate', 'taxPercent'].includes(id)) {
            if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
        }
        if (id === 'phoneNumber') {
            if (value !== '' && !/^\d+$/.test(value)) return;
            if (value.length > 10) return;

            // Validation Logic: Show error if not exactly 10 digits
            if (value.length > 0 && value.length < 10) {
                setError("Phone number must be exactly 10 digits");
            } else {
                setError(null);
            }
        }
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleEdit = (row: InvoiceItem) => {
        setEditingId(row.id);
        const taxP = row.tax > 0 ? ((row.tax * 100) / (row.quantity * row.rate)).toFixed(0) : "0";
        setFormData({ ...formData, item: row.item, quantity: row.quantity.toString(), rate: row.rate.toString(), taxPercent: taxP });
    };

    const handleAction = (e: FormEvent) => {
        e.preventDefault();

        
        if (formData.phoneNumber.length !== 10) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        const qty = Number(formData.quantity) || 0;
        const rate = Number(formData.rate) || 0;
        const taxVal = (qty * rate * Number(formData.taxPercent || 0)) / 100;
        const totalVal = (qty * rate) + taxVal;

        if (editingId !== null) {
            setSubmittedData(prev => prev.map(i => i.id === editingId ? { ...i, item: formData.item, quantity: qty, rate: rate, tax: taxVal, total: totalVal } : i));
            setEditingId(null);
        } else {
            setSubmittedData([...submittedData, { id: Date.now(), date: todayDate, item: formData.item, quantity: qty, rate: rate, tax: taxVal, total: totalVal }]);
        }
        setFormData(prev => ({ ...prev, item: '', quantity: '', rate: '', taxPercent: '' }));
    };

    const labelStyle = "text-sm font-semibold text-black-800 mb-1.5 block  text-[16px]";
    const inputClass = "w-full bg-blue-50/30 border border-gray-100 rounded-lg px-4 py-3 outline-none text-gray-700 text-sm focus:ring-2 focus:ring-blue-700/10 transition";


    return (
        <div className="min-h-screen bg-blue-50/50 font-sans py-8 px-4 sm:px-6">
            <div ref={invoiceRef} className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100/50 p-6 sm:p-10">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Invoice Builder</h2>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{formData.invoiceNumber}</p>
                    </div>
                    <div className="flex gap-3 action-hide w-full sm:w-auto">
                        <button
                            onClick={handleReset}
                            className="cursor-pointer flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase transition shadow-md active:scale-95"
                        >
                            Reset
                        </button>
                        <button onClick={() => window.history.back()} className="cursor-pointer flex-1 sm:flex-none bg-orange-700 hover:bg-orange-800 text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase transition shadow-md active:scale-95">Home</button>
                    </div>
                </div>

                <hr className="border-t border-gray-200 mb-8" />

                <form onSubmit={handleAction} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div><label className={labelStyle}>Client Name</label><input id="name" value={formData.name} onChange={handleChange} className={inputClass} required placeholder='Enter Name...' /></div>
                        <div><label className={labelStyle}>Invoice No</label><input value={formData.invoiceNumber} readOnly className={`${inputClass} bg-gray-50/50 text-gray-400 cursor-not-allowed`} /></div>

                        <div>
                            <label className={labelStyle}>Phone Number</label>
                            <input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`${inputClass} ${error ? 'border-red-500 focus:ring-red-500/10' : 'focus:ring-blue-700/10'}`}
                                placeholder="1234567890"
                                required
                            />
                            {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
                        </div>

                        <div><label className={labelStyle}>Date</label><input value={todayDate} readOnly className={`${inputClass} bg-gray-50/50 text-gray-400 cursor-not-allowed`} /></div>
                    </div>

                    <div>
                        <label className={labelStyle}>Invoice Description</label>
                        <textarea id="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-16 resize-none`} placeholder="Add invoice notes..." />
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap items-end gap-3 pt-8 border-t border-gray-100 action-hide bg-blue-50/10 p-4 rounded-xl">
                        <div className="w-full lg:flex-1"><label className={labelStyle}>Item Name</label><input id="item" placeholder="Enter Item" value={formData.item} onChange={handleChange} className={inputClass} /></div>
                        <div className="w-[80px]"><label className={labelStyle}>Qty</label><input id="quantity" placeholder="0" value={formData.quantity} onChange={handleChange} className={`${inputClass} text-center`} /></div>
                        <div className="w-[100px]"><label className={labelStyle}>Rate</label><input id="rate" placeholder="0.00" value={formData.rate} onChange={handleChange} className={`${inputClass} text-center`} /></div>
                        <div className="w-[80px]"><label className={labelStyle}>Tax %</label><input id="taxPercent" placeholder="0" value={formData.taxPercent} onChange={handleChange} className={`${inputClass} text-center`} /></div>
                        <div className="flex gap-2">
                            <button type="submit" className={`cursor-pointer w-20 py-3 rounded-lg shadow-md font-bold text-xl text-white transition-all active:scale-95 ${editingId ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-500'}`}>
                                {editingId ? '✓' : '+'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadPDF}
                                disabled={submittedData.length === 0 || isGenerating}
                                className={`w-20 py-3 rounded-lg shadow-md flex justify-center items-center text-lg transition-all ${submittedData.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'cursor-pointer bg-zinc-400 text-white hover:bg-zinc-400 active:scale-95'
                                    }`}>
                                📥
                            </button>
                        </div>
                    </div>
                </form>

                <div className="w-full overflow-x-auto border-t border-b border-gray-100">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr className=" text-[13px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4 text-center">Qty</th>
                                <th className="px-6 py-4 text-center">Rate</th>
                                <th className="px-6 py-4 text-center">Total</th>
                                <th className="px-6 py-4 text-center action-hide">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 text-sm font-medium">
                            {submittedData.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center text-gray-400 italic font-normal">No items added yet.</td></tr>
                            ) : (
                                submittedData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 text-gray-400">{row.date}</td>
                                        <td className="px-6 py-4 tracking-tight">{row.item}</td>
                                        <td className="px-6 py-4 text-center">{row.quantity}</td>
                                        <td className="px-6 py-4 text-center">₹{row.rate.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-700">₹{row.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center action-hide space-x-4">
                                            <button onClick={() => handleEdit(row)} className="text-red-500 text-lg transition-transform active:scale-75 cursor-pointer">✎</button>
                                            <button onClick={() => setSubmittedData(prev => prev.filter(i => i.id !== row.id))} className="cursor-pointer text-red-500 text-lg transition-transform active:scale-75">🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-x border-b border-gray-200 rounded-b-xl overflow-hidden mb-10">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-t border-gray-200">
                                <td className="px-6 py-3.5 text-right font-bold text-[13px] text-gray-800 bg-gray-50/50 uppercase tracking-tighter">Subtotal</td>
                                <td className="w-40 px-6 py-3.5 text-right font-semibold text-[13px] text-gray-800 border-l border-gray-200 bg-white">₹{subtotal.toFixed(2)}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-6 py-3.5 text-right font-bold text-[13px] text-gray-800 bg-gray-50/50 uppercase tracking-tighter">Tax</td>
                                <td className="w-40 px-6 py-3.5 text-right font-semibold text-[13px] text-gray-800 border-l border-gray-200 bg-white">₹{totalTax.toFixed(2)}</td>
                            </tr>
                            <tr className="bg-blue-50/60 border-t border-gray-200">
                                <td className="px-6 py-4 text-right font-bold text-[13px] text-gray-900 uppercase tracking-tight">Total Amount Due</td>
                                <td className="w-40 px-6 py-4 text-right font-black text-[13px] text-blue-700 border-l border-gray-100 text-xl tracking-tight">₹{grandTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Add;
