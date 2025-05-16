import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import "../../assets/styles/employee/Updatemydetails.scss";
import { GET_EMPLOYEE_BY_ID } from "../../constants/query"; // Update path
import { UPDATE_EMPLOYEE } from "../../constants/mutations";

interface OptionType {
  value: string;
  label: string;
}

const Updatemydetails: React.FC = () => {
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
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("employee_id");
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  // GraphQL query for employee data
  const { loading: employeeLoading, data: employeeData } = useQuery(GET_EMPLOYEE_BY_ID, {
    variables: { getEmployeebyIdId: employeeId },
    skip: !employeeId,
    pollInterval: 1000,
  });

  useEffect(() => {
    if (!employeeId) {
      setError("No employee ID found in session.");
      return;
    }

    const fetchStaticData = async () => {
      try {
        // Keep axios for hobbies and educations (as requested)
        const hobbiesRes = await axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_HOBBIES)
        const educationsRes = await axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_EDUCATION)  
        

        // Transform API data to match react-select's expected format
        const educationOptions: OptionType[] = educationsRes.data.map(
          (edu: any) => ({
            value: edu.name,
            label: edu.name,
          })
        );

        const hobbyOptions: OptionType[] = hobbiesRes.data.map(
          (hobby: any) => ({
            value: hobby.name,
            label: hobby.name,
          })
        );

        setAvailableEducations(educationOptions);
        setAvailableHobbies(hobbyOptions);

      } catch (err) {
        setError("Failed to fetch static data." + err);
      }
    };

    fetchStaticData();
  }, []);

  // When employee data loads from GraphQL
  useEffect(() => {
    if (employeeData?.getEmployeebyId && availableEducations.length && availableHobbies.length) {
      const employee = employeeData.getEmployeebyId;
      
      // Find the selected education and hobbies based on names
      const selectedEducations = availableEducations.filter(edu => 
        employee.educations.includes(edu.value)
      );

      const selectedHobbies = availableHobbies.filter(hobby => 
        employee.hobbies.includes(hobby.value)
      );

      setForm({
        name: employee.EName,
        phone_no: employee.Ephone,
        birth_date: employee.Ebirth_date,
        gender: employee.Egender,
        description: employee.Edescription,
        education: selectedEducations,
        hobbies: selectedHobbies,
      });
    }
  }, [employeeData, availableEducations, availableHobbies]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHobbiesChange = (selected: OptionType[] | null) => {
    setForm((prev) => ({
      ...prev,
      hobbies: selected || [],
    }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setForm((prev) => {
      if (checked) {
        const selectedEdu = availableEducations.find(
          (edu) => edu.value === value
        );
        return {
          ...prev,
          education: selectedEdu
            ? [...prev.education, selectedEdu]
            : prev.education,
        };
      } else {
        return {
          ...prev,
          education: prev.education.filter((edu) => edu.value !== value),
        };
      }
    });
  };

  const handleSubmit = async () => {
  if (!employeeId) return;

  try {
    const submissionData = {
      name: form.name,
      phone_no: form.phone_no,
      birth_date: form.birth_date,
      gender: form.gender,
      description: form.description,
      education: form.education.map((edu) => edu.value).join(","), // <-- comma-separated
      hobbies: form.hobbies.map((hobby) => hobby.value).join(","), // <-- comma-separated
    };

    const { data } = await updateEmployee({
      variables: {
        input: submissionData,
        updateEmployeeId: employeeId
      }
    });

    setSnackbarSeverity("success");
    setSnackbarMessage(data?.updateEmployee?.message || "Details updated successfully.");
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (err) {
    // console.error("Update error:", err);
    setSnackbarSeverity("error");
    setSnackbarMessage("Failed to update details.");
    setSnackbarOpen(true);
  }
};


  if (error) return <div className="update-error">{error}</div>;
  if (employeeLoading || !form.name) return <div className="update-loading">Loading...</div>;

  return (
    <>
      <div className="update-form-container">
        <h2>Update My Details</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="phone_no"
          value={form.phone_no}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
        />
        <input
          name="gender"
          value={form.gender}
          onChange={handleChange}
          placeholder="Gender"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <div className="education-checkbox-group">
          <h4>Education</h4>
          {availableEducations.map((edu) => (
            <label key={edu.value} className="checkbox-label">
              <input
                type="checkbox"
                value={edu.value}
                checked={form.education.some((e) => e.value === edu.value)}
                onChange={handleEducationChange}
              />
              {edu.label}
            </label>
          ))}
        </div>

        <div className="hobbies-select-container">
          <h4>Hobbies</h4>
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
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
              control: (provided) => ({
                ...provided,
                maxHeight: "150px",
                overflow: "auto",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "#3498db",
                color: "white",
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: "white",
              }),
            }}
          />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Updatemydetails;