import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPrint,
  FaDownload,
  FaCircleCheck,
  FaStore,
  FaTruckFast,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa6";
import { getOrderInvoice } from "../../store/feature/orderSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const { oId } = useParams(); // Get order ID from URL parameter
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoiceRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  const { invoice, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  // Fetch invoice data from API on mount
  useEffect(() => {
    if (oId && user) {
      dispatch(getOrderInvoice(oId));
    }
  }, [oId, user, dispatch]);

  // Handle loading state
  if (loading && !invoice) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center">
        <FaSpinner className="text-4xl text-teal-600 animate-spin mb-4" />
        <p className="text-slate-500 animate-pulse">Loading invoice...</p>
      </div>
    );
  }

  // Handle error state
  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-full mb-4">
          <FaCircleCheck className="text-4xl text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Invoice Not Found
        </h2>
        <p className="text-slate-500 mb-6 text-center">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Fallback if no invoice data
  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          No Invoice Data
        </h2>
        <p className="text-slate-500 mb-6 text-center">
          We couldn't find invoice data for this order.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Format the data from API
  const orderData = {
    orderId: invoice.orderNumber,
    date: invoice.date
      ? new Date(invoice.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString(),
    customer: invoice.customer || {},
    items: invoice.items || [],
    subtotal: invoice.pricing?.subtotal || 0,
    shippingCost: invoice.pricing?.shipping || 0,
    discount: invoice.pricing?.discount || 0,
    total: invoice.pricing?.total || 0,
    status: invoice.status || "Processing",
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const element = invoiceRef.current;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F4F7F6",
      });

      const imgData = canvas.toDataURL("image/png");
      const margin = 40;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width + margin * 2, canvas.height + margin * 2],
      });

      pdf.addImage(imgData, "PNG", margin, margin, canvas.width, canvas.height);
      pdf.save(`Invoice_${orderData.orderId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-emerald-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 md:py-12 px-4 font-sans print:bg-white print:py-0 print:px-0">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 print:hidden text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2">
            <FaCircleCheck /> Payment Successful
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Thank you for your order!
          </h1>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 md:flex-none bg-white border px-4 md:px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 md:flex-none bg-white border px-4 md:px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <FaPrint className="text-emerald-500" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 md:flex-none bg-emerald-600 text-white px-4 md:px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaDownload /> {isDownloading ? "..." : "Save PDF"}
          </button>
        </div>
      </div>

      {/* Main Document Section */}
      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl md:rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none"
      >
        {/* Header Section */}
        <div className="relative bg-slate-900 p-6 md:p-14 text-white overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 hidden md:block">
            <FaStore size={200} className="-mr-20 -mt-10 rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <FaStore className="text-xl md:text-2xl text-white" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tight">
                  KachaBazar
                </span>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
                Official Purchase Invoice
              </p>
            </div>

            <div className="text-left md:text-right w-full md:w-auto border-t border-slate-800 pt-6 md:border-none md:pt-0">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                Order Identifier
              </p>
              <p className="text-xl md:text-2xl font-mono font-medium tracking-tighter">
                {orderData.orderId}
              </p>
              <div className="mt-4 flex md:justify-end gap-6 text-[11px] md:text-xs text-slate-400">
                <div>
                  <p className="font-bold text-white uppercase text-[9px] mb-1">
                    Date
                  </p>
                  <p>{orderData.date}</p>
                </div>
                <div>
                  <p className="font-bold text-white uppercase text-[9px] mb-1">
                    Status
                  </p>
                  <p className={getStatusColor(orderData.status)}>
                    {orderData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-8 md:pb-12 border-b border-slate-100 mb-8 md:mb-12">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>{" "}
                Billed To
              </h4>
              <div className="space-y-1">
                <p className="text-base md:text-lg font-bold text-slate-900">
                  {orderData.customer.name || "Customer"}
                </p>
                <p className="text-xs md:text-sm text-slate-500">
                  {orderData.customer.email}
                </p>
                <p className="text-xs md:text-sm text-slate-500">
                  {orderData.customer.phone}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaTruckFast className="text-emerald-500" /> Delivery Address
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                {orderData.customer.address || "No address provided"}
              </p>
              {orderData.customer.shippingMethod && (
                <p className="text-xs md:text-sm text-teal-600 mt-2 font-medium">
                  Shipping: {orderData.customer.shippingMethod}
                </p>
              )}
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full mb-10 min-w-[500px] md:min-w-0">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="text-left pb-4 font-black">Product</th>
                  <th className="text-center pb-4 font-black">Qty</th>
                  <th className="text-right pb-4 font-black">Price</th>
                  <th className="text-right pb-4 font-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orderData.items.length > 0 ? (
                  orderData.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4 md:py-6">
                        <p className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
                          {item.title || "Product"}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                          SKU: {item.pId || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 md:py-6 text-center font-medium text-slate-600 text-sm">
                        ×{item.quantity}
                      </td>
                      <td className="py-4 md:py-6 text-right font-medium text-slate-600 text-sm whitespace-nowrap">
                        ${(item.price || 0).toFixed(2)}
                      </td>
                      <td className="py-4 md:py-6 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-slate-300 italic"
                    >
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-slate-50 p-6 md:p-8 rounded-2xl">
            <div className="max-w-full md:max-w-[280px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Important Information
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Thank you for shopping at KachaBazar. Please keep this receipt
                for any return or exchange requests within 7 days of delivery.
              </p>
            </div>

            <div className="w-full md:w-72 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">
                  ${orderData.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Shipping</span>
                <span className="font-bold text-slate-900">
                  ${orderData.shippingCost.toFixed(2)}
                </span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-${orderData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] md:text-sm font-black uppercase text-slate-900">
                  Total Paid
                </span>
                <span className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">
                  ${orderData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] md:tracking-[0.5em]">
              www.kachabazar.com
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @media print {
          @page { margin: 15mm; }
          body { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
