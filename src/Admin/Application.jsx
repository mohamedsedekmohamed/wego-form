import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShareAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterJob, setFilterJob] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filtermarital, setFiltermarital] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterFavourite, setFilterFavourite] = useState("");

  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://careerbcknd.wegostation.com/admin/application", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data.applications || []))
      .catch((err) => console.error("Error fetching applications:", err));
  }, [update]);

  const jobs = [...new Set(applications.map((app) => app.job).filter(Boolean))];
  const cities = [
    ...new Set(applications.map((app) => app.city).filter(Boolean)),
  ];
  const maritals = [
    ...new Set(applications.map((app) => app.marital).filter(Boolean)),
  ];

  const filteredApps = applications.filter((app) => {
  const matchesJob = filterJob ? app.job === filterJob : true;
  const matchesCity = filterCity ? app.city === filterCity : true;
  const matchesmarital = filtermarital ? app.marital === filtermarital : true;
  const matchesFavourite = filterFavourite !== "" ? app.favourite === Number(filterFavourite) : true;

  const matchesSearch = searchTerm
    ? [app.name, app.city, app.phone, app.job, app.marital].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : true;

  return (
    matchesJob &&
    matchesCity &&
    matchesmarital &&
    matchesFavourite &&
    matchesSearch
  );
});

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  const deleteApp = (id) => {
    axios
      .delete(
        `https://careerbcknd.wegostation.com/admin/application/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUpdate((p) => !p);
        toast.success("Application deleted successfully ✅");
      })
      .catch(() => {
        toast.error("Failed to delete the application ❌");
      });
  };

  const resetFilters = () => {
  setFilterJob("");
  setFilterCity("");
  setFiltermarital("");
  setFilterFavourite("");
  setSearchTerm("");
  setCurrentPage(1);
};
const shareApp = (app) => {
  const shareData = {
    title: `Application: ${app.name}`,
    text: `
📄 Name: ${app.name}
💼 Job: ${app.job}
🏙️ City: ${app.city}
📞 Phone: ${app.phone}
❤️ Favourite: ${app.favourite === 1 ? "Yes" : "No"}
`.trim(),
  };
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => toast.success("Shared successfully ✅"))
      .catch((err) => console.error("Share failed:", err));
  } else {
    navigator.clipboard.writeText(shareData.text);
    toast.info("Sharing not supported — copied to clipboard 📋");
  }
};

  const favouriteApp = (id, favourite) => {
    const newFavourite = favourite === 1 ? 0 : 1; 

    axios
      .put(
        `https://careerbcknd.wegostation.com/admin/application/status/${id}`,
        { favourite: newFavourite },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUpdate((p) => !p);
        toast.success("Application favourite status changed ✅");
      })
      .catch(() => {
        toast.error("Failed to change favourite status ❌");
      });
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-center" />
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📄 Applications</h1>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Job:</label>
          <select
            value={filterJob}
            onChange={(e) => {
              setFilterJob(e.target.value);
              setCurrentPage(1);
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
<div className="flex items-center gap-2">
  <label className="font-medium text-gray-700">Favourite:</label>
  <select
    value={filterFavourite}
    onChange={(e) => {
      setFilterFavourite(e.target.value);
      setCurrentPage(1);
    }}
    className="border rounded px-3 py-1"
  >
    <option value="">All</option>
    <option value="1">Favourite</option>
    <option value="0">Not Favourite</option>
  </select>
</div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">City:</label>
          <select
            value={filterCity}
            onChange={(e) => {
              setFilterCity(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="">All</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Maritals:</label>
          <select
            value={filtermarital}
            onChange={(e) => {
              setFiltermarital(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="">All</option>
            {maritals.map((mar, idx) => (
              <option key={idx} value={mar}>
                {mar}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="font-medium text-gray-700">Search:</label>
          <input
            type="text"
            placeholder="Search by name, phone, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />
          <button
            onClick={() => setSearchTrigger(!searchTrigger)}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Job</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.map((app, index) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-3 border">{app.name}</td>
                <td className="p-3 border">{app.job}</td>
                <td className="p-3 border">{app.city}</td>
                <td className="p-3 border">{app.phone}</td>
                <td className="p-3 border text-center space-x-2 flex justify-center flex-wrap">
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
                  <button
                    onClick={() => favouriteApp(app.id, app.favourite)}
                    className=" transition"
                  >
                    {app.favourite === 1 ? (
                      <FaHeart className="text-pink-700" size={18} />
                    ) : (
                      <FaRegHeart size={18} />
                    )}
                  </button>
                  <button
  onClick={() => shareApp(app)}
  className="text-green-600 hover:text-green-800 transition"
  title="Share Application"
>
  <FaShareAlt  size={18} />
</button>

                </td>
              </tr>
            ))}
            {currentApps.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
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
                {app.job} - {app.city}, {app.country}
              </p>
              <p className="text-sm text-gray-500">{app.phone}</p>
            </div>
            <div className="flex gap-6">
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
                 <button
                    onClick={() => favouriteApp(app.id, app.favourite)}
                    className=" transition"
                  >
                    {app.favourite === 1 ? (
                      <FaHeart className="text-pink-700" size={18} />
                    ) : (
                      <FaRegHeart size={18} />
                    )}
                  </button>
                  <button
  onClick={() => shareApp(app)}
  className="text-green-600 hover:text-green-800 transition"
  title="Share Application"
>
  <FaShareAlt  size={18} />
</button>

            </div>
          </div>
        ))}
        {currentApps.length === 0 && (
          <p className="text-center text-gray-500">لا توجد طلبات</p>
        )}
      </div>

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

      {/* 📄 نافذة التفاصيل */}
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

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <InfoItem label="Birth Date" value={selectedApp.birth_date} />
                <InfoItem label="Phone" value={selectedApp.phone} />
                <InfoItem
                  label="Graduate Date"
                  value={selectedApp.graduate_date}
                />
                <InfoItem label="Address" value={selectedApp.address} />
                <InfoItem label="Experiences" value={selectedApp.experiences} />
                <InfoItem label="Current Job" value={selectedApp.current_job} />
                <InfoItem label="Courses" value={selectedApp.courses} />
                <InfoItem
                  label="Expected Salary"
                  value={selectedApp.expected_salary}
                />
                <InfoItem label="University" value={selectedApp.university} />
                <InfoItem label="Collage" value={selectedApp.collage} />
                <InfoItem label="Marital" value={selectedApp.marital} />
                <InfoItem label="Children" value={selectedApp.children} />
                <InfoItem
                  label="Qualification"
                  value={selectedApp.qualification}
                />
                <InfoItem label="Country" value={selectedApp.country} />
                <InfoItem label="City" value={selectedApp.city} />

                <p className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-700">
                    {selectedApp.link_name || "-"}:{" "}
                  </span>
                  <a
                    href={selectedApp.link}
                    className="text-gray-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedApp.link || "-"}
                  </a>
                </p>

                <a
                  href={selectedApp.cv}
                  download={selectedApp.cv}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
                >
                  Download CV
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
    <span className="text-gray-600 break-words block">{value || "-"}</span>
  </p>
);

export default Application;
