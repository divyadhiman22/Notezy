const PopUpAlert = ({ title = "Alert", message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-[#1e293b] text-white p-6 rounded-xl shadow-lg max-w-sm w-full border border-gray-700">
        <h2 className="text-lg font-bold mb-3 text-indigo-400">{title}</h2>
        <p className="text-sm mb-5">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 transition px-4 py-2 rounded-md text-sm"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-md text-sm"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpAlert;
