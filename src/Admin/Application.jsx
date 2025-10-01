import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Application = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterJob, setFilterJob] = useState(""); // فلتر الوظيفة
  const itemsPerPage = 5;
const[update,setUpdata]=useState(false)
const token = localStorage.getItem("token");
  useEffect(() => {

    axios
      .get("https://careerbcknd.wegostation.com/admin/application", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data.applications || []))
      .catch((err) => console.error("Error fetching applications:", err));
  }, [update]);

  const jobs = [...new Set(applications.map((app) => app.job))];

  const filteredApps = filterJob
    ? applications.filter((app) => app.job === filterJob)
    : applications;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
const deleteApp = (id) => {
    axios
      .delete(`https://careerbcknd.wegostation.com/admin/application/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUpdata((P) => !P);
        toast.success("Application deleted successfully ✅");
      })
      .catch(() => {
        toast.error("Failed to delete the application ❌");
      });
  
};

  return (
    <div className="p-4">
            <ToastContainer position="top-center" />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📄 Applications</h1>

      {/* فلتر الوظائف */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium text-gray-700"> Jobs:</label>
        <select
          value={filterJob}
          onChange={(e) => {
            setFilterJob(e.target.value);
            setCurrentPage(1); // ارجع لأول صفحة
          }}
          className="border rounded px-3 py-1"
        >
          <option value="">All</option>
          {jobs.map((job, idx) => (
            <option key={idx} value={job}>
              {job}
            </option>
          ))}
        </select>
      </div>

      {/* جدول متجاوب */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Job</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.map((app,index) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-3 border">{index+1}</td>
                <td className="p-3 border">{app.name}</td>
                <td className="p-3 border">{app.job}</td>
                <td className="p-3 border">{app.city}</td>
                <td className="p-3 border">{app.phone}</td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    onClick={() => deleteApp(app.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <RiDeleteBin6Fill size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {currentApps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  لا توجد طلبات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {currentApps.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{app.name}</p>
              <p className="text-sm text-gray-500">
                {app.job} - {app.city}
              </p>
              <p className="text-sm text-gray-500">{app.phone}</p>
            </div>
           <div className="flex gap-24">
             <button
              onClick={() => setSelectedApp(app)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <FaEye size={20} />
            </button>
              <button
                    onClick={() => deleteApp(app.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <RiDeleteBin6Fill size={18} />
                  </button>
            </div>
          </div>
        ))}
        {currentApps.length === 0 && (
          <p className="text-center text-gray-500">لا توجد طلبات</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center flex-wrap items-center gap-2 mt-6">
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

  {selectedApp && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col animate-fadeIn relative">
      
      <button
        onClick={() => setSelectedApp(null)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
      >
        <FaTimes size={22} />
      </button>

      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 px-6 pt-5">
        Info: {selectedApp.name}
      </h2>

      {/* المحتوى مع scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem label="Birth Date" value={selectedApp.birth_date} />
          <InfoItem label="Phone " value={selectedApp.phone} />
          <InfoItem label="Graduate Date" value={selectedApp.graduate_date} />
          <InfoItem label="Address" value={selectedApp.address} />
          <InfoItem label="Experiences" value={selectedApp.experiences} />
          <InfoItem label="Current Job" value={selectedApp.current_job} />
          <InfoItem label="Courses" value={selectedApp.courses} />
          <InfoItem label="Expected Salary" value={selectedApp.expected_salary} />
          <InfoItem label="University" value={selectedApp.university} />
          <InfoItem label="Collage" value={selectedApp.collage} />
          <InfoItem label="Marital" value={selectedApp.marital} />
          <InfoItem label="Children" value={selectedApp.children} />
          <InfoItem label="Qualification" value={selectedApp.qualification} />
 <p className="bg-gray-50 p-3 rounded-lg shadow-sm">
    <span className="font-semibold text-gray-700">{selectedApp.link_name || "-"}: </span>
    <a href={selectedApp.link} className="text-gray-600 underline">{selectedApp.link   || "-"}</a>
  </p>   
  <a
  href={selectedApp.cv}    // المسار للملف
  download={selectedApp.cv}          // الاسم اللي هيتحمل بيه
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
 cv
</a>
       </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
};
const InfoItem = ({ label, value }) => (
  <p className="bg-gray-50 p-3 rounded-lg shadow-sm">
    <span className="font-semibold text-gray-700">{label}: </span>
    <span className="text-gray-600">{value || "-"}</span>
  </p>
);
export default Application;
