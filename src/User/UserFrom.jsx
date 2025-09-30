import { useState, useEffect, useRef } from "react";
import { 
  User, MapPin, Building, GraduationCap, Calendar, 
  Phone, Briefcase, PoundSterling, School, Heart, Baby
} from "lucide-react";
import axios from "axios";
import wego from '../assets/wego.png'
import { GoProjectSymlink } from "react-icons/go";

const translations = {
  en: {
    careerRegistration: "Career Registration",
    careerSubText: "Join our career platform and find your dream job",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    phone: "Phone Number",
    birthDate: "Birth Date",
    city: "City",
    address: "Address",
    marital: "Marital Status",
    children: "Number of Children",
    educationInfo: "Education Information",
    qualification: "Qualification",
    graduateDate: "Graduation Date",
    university: "University",
    collage: "College/Faculty",
    careerInfo: "Career Information",
    job: "Job Position",
    salary: "Expected Salary",
    currentJob: "Current Job",
    experiences: "Work Experience & Skills",
    courses: "Courses & Certifications",
    submit: "Submit Application",
    submitting: "Submitting Application...",
    securityCheck: "Security Check",
    enterSecurity: "Please enter the security password",
    wrongSecurity: "Wrong security number ❌",
    serverError: "Server error, please try again later ❌",
    single: "Single",
    married: "Married",
    separated: "Separated",
    link:"link",
    Upload_CV:"Upload_CV"
  },
  ar: {
    Upload_CV:"تحميل السيرة الذاتية",
    careerRegistration: "تسجيل للوظيفة",
    careerSubText: "انضم إلى منصتنا الوظيفية وابحث عن وظيفتك المثالية",
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    birthDate: "تاريخ الميلاد",
    link:"لينك",
    city: "المدينة",
    address: "العنوان",
    marital: "الحالة الاجتماعية",
    children: "عدد الأطفال",
    educationInfo: "المؤهل الدراسي",
    qualification: "المؤهل",
    graduateDate: "تاريخ التخرج",
    university: "الجامعة",
    collage: "الكلية",
    careerInfo: "المعلومات الوظيفية",
    job: "الوظيفة",
    salary: "الراتب المتوقع",
    currentJob: "الوظيفة الحالية",
    experiences: "الخبرات والمهارات",
    courses: "الدورات والشهادات",
    submit: "إرسال الطلب",
    submitting: "جاري إرسال الطلب...",
    securityCheck: "التحقق الأمني",
    enterSecurity: "من فضلك أدخل الرقم السري",
    wrongSecurity: "الرقم السري غير صحيح ❌",
    serverError: "خطأ في الخادم، حاول لاحقًا ❌",
    single: "أعزب",
    married: "متزوج",
    separated: "منفصل",
  }
};

const UserFrom=()=> {
  const [formData, setFormData] = useState({
    name: "",
    qualification_id: "",
    city_id: "",
    job_id: "",
    birth_date: "",
    graduate_date: "",
    address: "",
    phone: "",
    experiences: "",
    current_job: "",
    courses: "",
    expected_salary: "",
    university: "",
    collage: "",
    marital: "",
    children: 0,
    upload_cv:null,
    link:""
  });

  const [data, setData] = useState({
    cities: [],
    jobs: [],
    qualifications: []
  });
  const fileInputRef = useRef(null);

  const [lang, setLang] = useState("en"); 
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [security, setSecurity] = useState(false);
  const [securityPassed, setSecurityPassed] = useState(false);
  const [password, setPassword] = useState("");
  const [number,setNumber]=useState("")

  useEffect(() => {
    axios
      .get(`https://careerbcknd.wegostation.com/api/lists?locale=${lang}`)
      .then((res) => {
        setData(res.data);
        setSecurity(res.security_status)
      })
      .catch((err) => {
        setMessage("Failed to load form data ❌");
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [lang]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `https://careerbcknd.wegostation.com/api/check_security?security_number=${password}`
      );

      if (response.data.security_number_status === true) {
        setNumber(response.data.security_number)
        setSecurityPassed(true);
      } else {
        setSecurityPassed(false);
        setMessage("Wrong security number ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error, please try again later ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const form = new FormData();
    form.append("security_number", number);

  Object.keys(formData).forEach((key) => {
  if (formData[key] !== null && formData[key] !== "") {
    if (key === "children" && formData.marital === "single") {
      return; 
    }
    form.append(key, formData[key]);
  }
});


    await axios.post(
      "https://careerbcknd.wegostation.com/api/send_email",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage("Registration successful! 🎉");

    setTimeout(() => {
      setFormData({
        name: "",
        qualification_id: "",
        city_id: "",
        job_id: "",
        birth_date: "",
        graduate_date: "",
        address: "",
        phone: "",
        experiences: "",
        current_job: "",
        courses: "",
        expected_salary: "",
        university: "",
        collage: "",
        marital: "",
        children: 0,
        upload_cv: null, 
        link: "",
      });
      if (fileInputRef.current) {
  fileInputRef.current.value = "";
}

      setMessage("");
    }, 3000);
  } catch (error) {
    setMessage("Registration failed ❌");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const t = translations[lang];

  if (dataLoading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E78439]"></div>
          <span className="text-[#E78437] font-medium">Loading form data...</span>
        </div>
      </div>
    );
  }

  if (security && !securityPassed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#E78437] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-[#E78437] bg-clip-text text-transparent">
              {translations[lang].careerRegistration}
            </h2>
            <p className="text-gray-600 mt-2">
              {translations[lang].careerSubText}
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full mb-4 px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#E78437] text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Submit
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-2xl text-center font-medium bg-red-100 text-red-800 border border-red-200">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
          <div dir={lang === "ar" ? "rtl" : "ltr"} className="relative">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="absolute top-4 right-0 md:right-2 lg:right-4 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
          </div>

          <div className="text-center mb-8">
            <div className=" rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <User className="w-8 h-8 text-white" /> */}
<img src={wego} className="w-50 h-15" alt="wego logo" />
            </div>
            <h2 className="text-3xl font-bold py-1 bg-[#E78437] bg-clip-text text-transparent">
              {t.careerRegistration}
            </h2>
            <p className="text-gray-600 mt-2">{t.careerSubText}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#E78437]" />
                {t.personalInfo}
              </h3>
            </div>

            <Field label={t.fullName} name="name" value={formData.name} onChange={handleChange} Icon={User} lang={lang} required />
            <Field label={t.phone} name="phone" value={formData.phone} onChange={handleChange} Icon={Phone} lang={lang} required />
<div className="mb-4">
  <label
    htmlFor="birth_date"
    className="block text-gray-700 mb-2"
  >
    {t.birthDate}
  </label>
  <div className="relative">
    <input
      id="birth_date"
      name="birth_date"
      type="date"
      value={formData.birth_date}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>
            <SelectField label={t.city} name="city_id" value={formData.city_id} onChange={handleChange} Icon={MapPin} options={data.cities} lang={lang} required />
            <TextareaField label={t.address} name="address" value={formData.address} onChange={handleChange} Icon={Building} lang={lang} required />

            <SelectField 
              label={t.marital} 
              name="marital" 
              value={formData.marital} 
              onChange={handleChange} 
              Icon={Heart} 
              options={[
                {id:"single", name:t.single}, 
                {id:"married", name:t.married}, 
                {id:"separated", name:t.separated}
              ]} 
              lang={lang}
              required 
            />
        {formData.marital==="single"|| formData.marital&&(
          <Field label={t.children} type="number" name="children" value={formData.children} onChange={handleChange} Icon={Baby} min="0" lang={lang} />
        )}  

            <div className="md:col-span-2 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-[#E78437]" />
                {t.educationInfo}
              </h3>
            </div>

            <SelectField label={t.qualification} name="qualification_id" value={formData.qualification_id} onChange={handleChange} Icon={GraduationCap} options={data.qualifications} lang={lang} required />
            <div className="mb-4">
  <label
    htmlFor="birth_date"
    className="block text-gray-700 mb-2"
  >
    {t.graduateDate}
  </label>
  <div className="relative">
    <input
      id="graduate_date"
      name="graduate_date"
      type="date"
      value={formData.graduate_date}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>
            <Field label={t.university} name="university" value={formData.university} onChange={handleChange} Icon={School} lang={lang} />
            <Field label={t.collage} name="collage" value={formData.collage} onChange={handleChange} Icon={Building} lang={lang} />

            <div className="md:col-span-2 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-[#E78437]" />
                {t.careerInfo}
              </h3>
            </div>

            <SelectField label={t.job} name="job_id" value={formData.job_id} onChange={handleChange} Icon={Briefcase} options={data.jobs} lang={lang} required />
            <Field label={t.salary} name="expected_salary" type="number" value={formData.expected_salary} onChange={handleChange} Icon={PoundSterling} min="0" lang={lang} required />
            <TextareaField label={t.currentJob} name="current_job" value={formData.current_job} onChange={handleChange} Icon={Briefcase} lang={lang} />
            <TextareaField label={t.experiences} name="experiences" value={formData.experiences} onChange={handleChange} Icon={Briefcase} lang={lang} required />
            <TextareaField label={t.courses} name="courses" value={formData.courses} onChange={handleChange} Icon={GraduationCap} lang={lang} />
            <Field label={t.link} name="link" value={formData.link} onChange={handleChange} Icon={GoProjectSymlink} lang={lang}  />
         <div className="flex flex-col space-y-2">
  <label className="text-sm font-medium text-gray-700">{t.Upload_CV}</label>
  
  <input
    type="file"
    ref={fileInputRef}
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, upload_cv: file });
      }
    }}
    className="hidden"
    id="upload_cv" 
    required
  />

  {/* Custom button */}
  <label
    htmlFor="upload_cv"
    className={`cursor-pointer flex items-center justify-center px-4 py-3 rounded-2xl 
               ${!formData.upload_cv?"bg-gray-500":"bg-[#E78437]"} text-white font-medium
               shadow-md hover:shadow-lg transition-all duration-200`}
  >
 {!formData.upload_cv?" Upload CV 📂" : formData.upload_cv.name}
  </label>

 
</div>






            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="w-full bg-[#E78437]  text-white py-3 rounded-lg">
                {loading ? t.submitting : t.submit}
              </button>
            </div>

            {message && (
              <div className={`md:col-span-2 mt-4 p-4 rounded-2xl text-center font-medium ${
                message.includes("successful") 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔹 Field Component
function Field({ label, name, type="text", value, onChange, Icon, lang, ...props }) {
  const isRTL = lang === "ar";
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 ${value?"text-[#E78437]":"text-gray-400"}  w-5 h-5`} />
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-4 bg-gray-50/50 border border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500`}
          {...props}
        />
      </div>
    </div>
  );
}

// 🔹 TextareaField Component
function TextareaField({ label, name, value, onChange, Icon, lang, ...props }) {
  const isRTL = lang === "ar";
  return (
    <div className="flex flex-col md:col-span-2">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className={`absolute ${isRTL ? "right-3" : "left-3"} top-4 ${value?"text-[#E78437]":"text-gray-400"} w-5 h-5`} />
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-4 bg-gray-50/50 border border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
          {...props}
        />
      </div>
    </div>
  );
}

// 🔹 SelectField Component
function SelectField({ label, name, value, onChange, Icon, options=[], lang, ...props }) {
  const isRTL = lang === "ar";
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 ${value?"text-[#E78437]":"text-gray-400"} w-5 h-5`} />
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-4 bg-gray-50/50 border border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
          {...props}
        >
          <option value="">{isRTL ? `اختر ${label}` : `Select ${label}`}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default UserFrom;
