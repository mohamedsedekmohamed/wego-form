import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Security = () => {
  const [security, setSecurity] = useState(null);
  const [formData, setFormData] = useState({ number: "", status: 1 });
  const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSecurity();
  }, []);

  const fetchSecurity = () => {
    axios
      .get("https://careerbcknd.wegostation.com/admin/security", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSecurity(res.data.secuirty_number);
        setFormData({
          number: res.data.secuirty_number?.number || "",
          status: res.data.secuirty_number?.status || 1,
        });
      })
      .catch(() => toast.error("فشل تحميل البيانات"));
  };

  const handleToggleStatus = () => {
    const newStatus = security.status === 1 ? 0 : 1;

    axios
      .put(
        `https://careerbcknd.wegostation.com/admin/security/status?status=${newStatus}`,
                {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchSecurity();
        toast.success("تم تحديث الحالة بنجاح");
      })
      .catch(() => toast.error("فشل في تحديث الحالة"));
  };

  const handleSave = () => {

    axios
      .post(
        `https://careerbcknd.wegostation.com/admin/security/add_update?number=${formData.number}&status=${formData.status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchSecurity();
        setShowModal(false);
        toast.success("تم حفظ البيانات بنجاح");
      })
      .catch(() => toast.error("فشل في حفظ البيانات"));
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-center" />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">🔐 Security</h1>

      {security && (
        <div className="border rounded-lg p-4 shadow bg-white flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Security Number: <span className="text-blue-600">{security.number}</span>
            </p>
            <p
              className={`font-semibold ${
                security.status === 1 ? "text-green-600" : "text-red-600"
              }`}
            >
              {security.status === 1 ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="flex gap-4">
            {/* زرار تغيير الحالة */}
            <button
              onClick={handleToggleStatus}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              {security.status === 1 ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
            </button>

            {/* زرار تعديل */}
            <button
              onClick={() => setShowModal(true)}
              className="text-green-600 hover:text-green-800 transition"
            >
              <FaEdit size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Modal التعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Edit Security Number</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Number</label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: Number(e.target.value) })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
