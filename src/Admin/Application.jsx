import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // عدد العناصر في الصفحة

  useEffect(() => {
    const token = localStorage.getItem("token"); // هات التوكين من التخزين

    axios
      .get("https://careerbcknd.wegostation.com/admin/application", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data.applications || []))
      .catch((err) => console.error("Error fetching applications:", err));
  }, []);

  // حساب البيانات المعروضة حسب الصفحة
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = applications.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📄 Applications</h1>

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
            {currentApps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-3 border">{app.id}</td>
                <td className="p-3 border">{app.name}</td>
                <td className="p-3 border">{app.job}</td>
                <td className="p-3 border">{app.city}</td>
                <td className="p-3 border">{app.phone}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض كـ كاردات في الموبايل */}
      <div className="grid gap-4 md:hidden">
        {currentApps.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{app.name}</p>
              <p className="text-sm text-gray-500">{app.job} - {app.city}</p>
              <p className="text-sm text-gray-500">{app.phone}</p>
            </div>
            <button
              onClick={() => setSelectedApp(app)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <FaEye size={20} />
            </button>
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

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              تفاصيل: {selectedApp.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><span className="font-semibold">Birth Date:</span> {selectedApp.birth_date}</p>
              <p><span className="font-semibold">Graduate Date:</span> {selectedApp.graduate_date}</p>
              <p><span className="font-semibold">Address:</span> {selectedApp.address}</p>
              <p><span className="font-semibold">Experiences:</span> {selectedApp.experiences}</p>
              <p><span className="font-semibold">Current Job:</span> {selectedApp.current_job}</p>
              <p><span className="font-semibold">Courses:</span> {selectedApp.courses}</p>
              <p><span className="font-semibold">Expected Salary:</span> {selectedApp.expected_salary}</p>
              <p><span className="font-semibold">University:</span> {selectedApp.university}</p>
              <p><span className="font-semibold">Collage:</span> {selectedApp.collage}</p>
              <p><span className="font-semibold">Marital:</span> {selectedApp.marital}</p>
              <p><span className="font-semibold">Children:</span> {selectedApp.children}</p>
              <p><span className="font-semibold">Qualification:</span> {selectedApp.qualification}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Application;
