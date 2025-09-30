import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const City = () => {
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: "", ar_name: "", status: 1 });

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    const token = localStorage.getItem("token");

    axios
      .get("https://careerbcknd.wegostation.com/admin/city", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCities(res.data.cities || []))
      .catch(() => toast.error("خطأ في تحميل المدن"));
  };

  // Toggle Status
  const handleToggleStatus = (cityId, currentStatus) => {
    const token = localStorage.getItem("token");

    axios
      .put(
        `https://careerbcknd.wegostation.com/admin/city/status/${cityId}?status=${
          currentStatus === 1 ? 0 : 1
        }`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchCities();
        toast.success("تم تغيير الحالة بنجاح");
      })
      .catch(() => toast.error("فشل في تحديث الحالة"));
  };

  // Delete confirm
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // Delete City
  const handleDelete = () => {
    const token = localStorage.getItem("token");

    axios
      .delete(`https://careerbcknd.wegostation.com/admin/city/delete/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchCities();
        toast.success("تم حذف المدينة بنجاح");
      })
      .catch(() => toast.error("فشل في حذف المدينة"))
      .finally(() => {
        setShowConfirm(false);
        setDeleteId(null);
      });
  };

  // Open Add/Edit Modal
  const openModal = (city = null) => {
    if (city) {
      setEditingCity(city);
      setFormData({
        name: city.name,
        ar_name: city.ar_name,
        status: city.status,
      });
    } else {
      setEditingCity(null);
      setFormData({ name: "", ar_name: "", status: 1 });
    }
    setShowModal(true);
  };

  // Save City (Add or Update)
  const handleSave = () => {
    const token = localStorage.getItem("token");

    if (editingCity) {
      axios
        .post(
          `https://careerbcknd.wegostation.com/admin/city/update/${editingCity.id}?ar_name=${formData.ar_name}&name=${formData.name}&status=${formData.status}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          fetchCities();
          setShowModal(false);
          toast.success("تم تعديل المدينة بنجاح");
        })
        .catch(() => toast.error("فشل في تعديل المدينة"));
    } else {
      axios
        .post(
          `https://careerbcknd.wegostation.com/admin/city/add?ar_name=${formData.ar_name}&name=${formData.name}&status=${formData.status}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          fetchCities();
          setShowModal(false);
          toast.success("تمت إضافة المدينة بنجاح");
        })
        .catch(() => toast.error("فشل في إضافة المدينة"));
    }
  };
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

// ✅ فلترة المدن بالاسم + الحالة
const filteredCities = cities.filter((city) => {
  const matchesSearch =
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (city.ar_name && city.ar_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchesStatus =
    statusFilter === "all"
      ? true
      : statusFilter === "active"
      ? city.status === 1
      : city.status === 0;

  return matchesSearch && matchesStatus;
});


  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCities = cities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(cities.length / itemsPerPage);

  return (
    <div className="p-4">
      <ToastContainer position="top-center" />

  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
  <h1 className="text-2xl font-bold text-gray-800">🏙️ Cities</h1>

  {/* 🔍 Search input مع label */}
  <div className="flex flex-col w-full md:w-64">
    <label className="mb-1 text-sm font-medium text-gray-700">Search</label>
    <input
      type="text"
      placeholder="Search city..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded px-3 py-2"
    />
  </div>

  {/* ✅ فلترة بالحالة مع label */}
  <div className="flex flex-col w-full md:w-40">
    <label className="mb-1 text-sm font-medium text-gray-700">Status</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>

  <button
    onClick={() => openModal()}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    <FaPlus /> Add City
  </button>
</div>


      {/* جدول (Desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">English Name</th>
              <th className="p-3 border">Arabic Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city,index) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="p-3 border">{index+1}</td>
                <td className="p-3 border">{city.name}</td>
                <td className="p-3 border">{city.ar_name || "-"}</td>
                <td className="p-3 border">
                  {city.status === 1 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-3 border flex gap-3 justify-center">
                  <button
                    onClick={() => handleToggleStatus(city.id, city.status)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {city.status === 1 ? (
                      <FaToggleOn size={22} />
                    ) : (
                      <FaToggleOff size={22} />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(city)}
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => confirmDelete(city.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* كروت (Mobile) */}
      <div className="grid gap-4 md:hidden">
        {currentCities.map((city) => (
          <div
            key={city.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{city.name}</p>
              <p className="text-sm text-gray-500">{city.ar_name || "-"}</p>
              <p
                className={`text-sm font-semibold ${
                  city.status === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {city.status === 1 ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleToggleStatus(city.id, city.status)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                {city.status === 1 ? (
                  <FaToggleOn size={22} />
                ) : (
                  <FaToggleOff size={22} />
                )}
              </button>
              <button
                onClick={() => openModal(city)}
                className="text-green-600 hover:text-green-800 transition"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => confirmDelete(city.id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          السابق
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          التالي
        </button>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              {editingCity ? "Edit City" : "Add City"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">English Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Arabic Name</label>
                <input
                  type="text"
                  value={formData.ar_name}
                  onChange={(e) =>
                    setFormData({ ...formData, ar_name: e.target.value })
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
                {editingCity ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
         <h2 className="text-lg font-bold mb-4">Delete Confirmation</h2>
<p className="mb-6">Are you sure you want to delete this city?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete 
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default City;
