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
import { GrUserWorker } from "react-icons/gr";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
    const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: "", ar_name: "",link_name:"",ar_link_name:"", status: 1 });

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {

    axios
      .get("https://careerbcknd.wegostation.com/admin/job", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => toast.error("خطأ في تحميل المدن"));
  };

  const handleToggleStatus = (jobId, currentStatus) => {

    axios
      .put(
        `https://careerbcknd.wegostation.com/admin/job/status/${jobId}?status=${
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

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {

    axios
      .delete(`https://careerbcknd.wegostation.com/admin/job/delete/${deleteId}`, {
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

  const openModal = (job = null) => {
    if (job) {
      setEditingCity(job);
      setFormData({
        name: job.name,
        ar_name: job.ar_name,
        link_name: job.link_name,
        ar_link_name: job.ar_link_name,
        status: job.status,
      });
    } else {
      setEditingCity(null);
      setFormData({ name: "", ar_name: "",link_name:"",ar_link_name:"", status: 1 });
    }
    setShowModal(true);
  };

  const handleSave = () => {

    if (editingCity) {
      axios
        .post(
          `https://careerbcknd.wegostation.com/admin/job/update/${editingCity.id}?ar_name=${formData.ar_name}&name=${formData.name}&status=${formData.status}&link_name=${formData.link_name}&ar_link_name=${formData.ar_link_name}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          fetchCities();
          setShowModal(false);
          toast.success("تم تعديل الوظيفة بنجاح");
        })
        .catch(() => toast.error("فشل في تعديل الوظيفة"));
    } else {
      axios
        .post(
          `https://careerbcknd.wegostation.com/admin/job/add?ar_name=${formData.ar_name}&name=${formData.name}&status=${formData.status}&link_name=${formData.link_name}&ar_link_name=${formData.ar_link_name}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          fetchCities();
          setShowModal(false);
          toast.success("تمت إضافة الوظيفة بنجاح");
        })
        .catch(() => toast.error("فشل في إضافة الوظيفة "));
    }
  };
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

const filteredJobs = jobs.filter((job) => {
  const matchesSearch =
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.ar_name && job.ar_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchesStatus =
    statusFilter === "all"
      ? true
      : statusFilter === "active"
      ? job.status === 1
      : job.status === 0;

  return matchesSearch && matchesStatus;
});


const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);


  return (
    <div className="p-4">
      <ToastContainer position="top-center" />

  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
  <h1 className="text-2xl font-bold text-gray-800"> jobs</h1>

  {/* 🔍 Search input مع label */}
  <div className="flex flex-col w-full md:w-64">
    <label className="mb-1 text-sm font-medium text-gray-700">Search</label>
    <input
      type="text"
      placeholder="Search job...."
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
    <FaPlus /> Add job
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
              <th className="p-3 border">English Link</th>
              <th className="p-3 border">Arabic Link</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job,index) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="p-3 border">{index+1}</td>
                <td className="p-3 border">{job.name}</td>
                <td className="p-3 border">{job.ar_name || "-"}</td>
                <td className="p-3 border">{job.link_name || "-"}</td>
                <td className="p-3 border">{job.ar_link_name || "-"}</td>
                <td className="p-3 border">
                  {job.status === 1 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-3 border flex gap-3 justify-center">
                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {job.status === 1 ? (
                      <FaToggleOn size={22} />
                    ) : (
                      <FaToggleOff size={22} />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(job)}
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => confirmDelete(job.id)}
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
        {currentJobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">
            English Name:{job.name}</p>
              <p className="text-sm text-gray-500"> Arabic Name:{job.ar_name || "-"}</p>
              <p className="text-sm text-gray-500">English Link:{job.link_name || "-"}</p>
              <p className="text-sm text-gray-500">Arabic Link:{job.ar_link_name || "-"}</p>
            
              <p
                className={`text-sm font-semibold ${
                  job.status === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {job.status === 1 ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleToggleStatus(job.id, job.status)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                {job.status === 1 ? (
                  <FaToggleOn size={22} />
                ) : (
                  <FaToggleOff size={22} />
                )}
              </button>
              <button
                onClick={() => openModal(job)}
                className="text-green-600 hover:text-green-800 transition"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => confirmDelete(job.id)}
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
                <label className="block mb-1 font-medium"> Arabic Link</label>
                <input
                  type="text"
                  value={formData.ar_link_name}
                  onChange={(e) =>
                    setFormData({ ...formData, ar_link_name: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
                            <div>
                <label className="block mb-1 font-medium">English link</label>
                <input
                  type="text"
                  value={formData.link_name}
                  onChange={(e) =>
                    setFormData({ ...formData, link_name: e.target.value })
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

      {/* Modal Delete Confirm */}
      {showConfirm && ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-lg font-bold mb-4"> Delete Confirmation</h2>
            <p className="mb-6"> Are you sure you want to delete this Jobs?</p>
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


export default Job