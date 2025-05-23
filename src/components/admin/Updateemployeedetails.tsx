import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "../../assets/styles/admin/Updateemployeedetails.scss";
import { useMutation } from "@apollo/client";
import { UPDATE_EMPLOYEE } from "../../constants/mutations";
// import { GET_EMPLOYEE_BY_ID } from "../../constants/query";

interface OptionType {
  value: string;
  label: string;
}

interface EmployeeData {
  id: number;
  name: string;
  phone_no: string;
  birth_date: string;
  gender: string;
  description: string;
  education: string[];
  hobbies: string[];
}

const Updateemployeedetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeId = new URLSearchParams(location.search).get("id");
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  const [form, setForm] = useState({
    name: "",
    phone_no: "",
    birth_date: "",
    gender: "",
    description: "",
    education: [] as OptionType[],
    hobbies: [] as OptionType[],
  });

  const [availableHobbies, setAvailableHobbies] = useState<OptionType[]>([]);
  const [availableEducations, setAvailableEducations] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!employeeId) {
      setSnackbarSeverity("error");
      setSnackbarMessage("No employee ID provided");
      setSnackbarOpen(true);
      navigate("/admin/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const [employeeRes, hobbiesRes, educationsRes] = await Promise.all([
          // axios.get(`${import.meta.env.VITE_GET_EMPLOYEE_BY_ID}/${employeeId}`),
          axios.get(`http://127.0.0.1:5000/employee/${employeeId}`),
          // axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_HOBBIES),
          axios.get('http://127.0.0.1:5000/get-all-available-hobbies'),
          // axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_EDUCATION),
          axios.get('http://127.0.0.1:5000/get-all-available-educations'),
        ]);

        const employeeData: EmployeeData = employeeRes.data;
        
        // Transform API data to match react-select's expected format
        const educationOptions: OptionType[] = educationsRes.data.map((edu: any) => {return {
          value: edu.name,
          label: edu.name,
        }});

        const hobbyOptions: OptionType[] = hobbiesRes.data.map((hobby: any) => {return {
          value: hobby.name,
          label: hobby.name,
        }});

        setAvailableEducations(educationOptions);
        setAvailableHobbies(hobbyOptions);

        // Find the selected education and hobbies based on names
        const selectedEducations = educationOptions.filter(edu => 
          {return employeeData.education.includes(edu.value)}
        );

        const selectedHobbies = hobbyOptions.filter(hobby => 
          {return employeeData.hobbies.includes(hobby.value)}
        );

        setForm({
          name: employeeData.name,
          phone_no: employeeData.phone_no,
          birth_date: employeeData.birth_date,
          gender: employeeData.gender,
          description: employeeData.description,
          education: selectedEducations,
          hobbies: selectedHobbies,
        });
      } catch (err) {
        // console.error("Fetch error:", err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to fetch employee data");
        setSnackbarOpen(true);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => {return { ...prev, [e.target.name]: e.target.value }});
  };

  const handleHobbiesChange = (selected: OptionType[] | null) => {
    setForm(prev => {return {
      ...prev,
      hobbies: selected || [],
    }});
  };

  const handleEducationChange = (selected: OptionType[] | null) => {
    setForm(prev => {return {
      ...prev,
      education: selected || [],
    }});
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!employeeId) return;

  try {
    // Convert arrays to comma-separated strings
    const submissionData = {
      name: form.name,
      phone_no: form.phone_no,
      birth_date: form.birth_date,
      gender: form.gender,
      description: form.description,
      education: form.education.map(edu => {return edu.value}).join(','), // Convert to string
      hobbies: form.hobbies.map(hobby => {return hobby.value}).join(',')  // Convert to string
    };

    // GraphQL mutation call
    const { data } = await updateEmployee({
      variables: {
        input: submissionData,
        updateEmployeeId: employeeId
      }
    });

    if (data.updateEmployee.message) {
      setSnackbarSeverity("success");
      setSnackbarMessage(data.updateEmployee.message);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  } catch (err) {
    // console.error("Update error:", err);
    setSnackbarSeverity("error");
    setSnackbarMessage("Failed to update employee details");
    setSnackbarOpen(true);
  }
};
  if (loading) {
    return <div className="loading-container">Loading employee data...</div>;
  }

  return (
    <div className="admin-update-container">
      <div className="admin-update-header">
        <h2>Update Employee Details</h2>
        <button 
          onClick={() => {return navigate("/")}} 
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-update-form">
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Education</label>
          <Select
            isMulti
            options={availableEducations}
            value={form.education}
            onChange={handleEducationChange}
            placeholder="Select Education"
            className="multi-select"
            classNamePrefix="select"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => {return { ...base, zIndex: 9999 }},
              control: (provided) => {return {
                ...provided,
                minHeight: '44px',
              }},
            }}
          />
        </div>

        <div className="form-group">
          <label>Hobbies</label>
          <Select
            isMulti
            options={availableHobbies}
            value={form.hobbies}
            onChange={handleHobbiesChange}
            placeholder="Select Hobbies"
            className="multi-select"
            classNamePrefix="select"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => {return { ...base, zIndex: 9999 }},
              control: (provided) => {return {
                ...provided,
                minHeight: '44px',
              }},
            }}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Employee
          </button>
          <button 
            type="button" 
            onClick={() => {return navigate("/")}}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => {return setSnackbarOpen(false)}}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => {return setSnackbarOpen(false)}}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Updateemployeedetails;