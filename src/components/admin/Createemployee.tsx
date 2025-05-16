import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { useMutation } from '@apollo/client';
import { ADD_EMPLOYEE_MUTATION } from '../../constants/mutations';
import '../../assets/styles/admin/Createemployee.scss';

interface OptionType {
  value: string;
  label: string;
}

const Createemployee: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone_no: '',
    birth_date: '',
    gender: '',
    description: '',
    education: [] as OptionType[],
    hobbies: [] as OptionType[],
    password: ''
  });

  const [availableHobbies, setAvailableHobbies] = useState<OptionType[]>([]);
  const [availableEducations, setAvailableEducations] = useState<OptionType[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);

  const [addEmployee, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_EMPLOYEE_MUTATION);

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [hobbiesRes, educationsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_HOBBIES),
          axios.get(import.meta.env.VITE_GET_ALL_AVAILABLE_EDUCATION)
        ]);

        setAvailableHobbies(hobbiesRes.data.map((hobby: any) => ({
          value: hobby.name,
          label: hobby.name
        })));

        setAvailableEducations(educationsRes.data.map((edu: any) => ({
          value: edu.name,
          label: edu.name
        })));
      } catch (err) {
        // console.error('Error fetching options:', err);
        showSnackbar('Failed to load options', 'error');
      }
    };

    fetchOptions();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHobbiesChange = (selected: OptionType[] | null) => {
    setForm(prev => ({ ...prev, hobbies: selected || [] }));
  };

  const handleEducationChange = (selected: OptionType[] | null) => {
    setForm(prev => ({ ...prev, education: selected || [] }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Convert arrays to comma-separated strings
    const input = {
      name: form.name,
      phone_no: form.phone_no,
      birth_date: form.birth_date,
      gender: form.gender,
      description: form.description,
      education: form.education.map(e => e.value).join(','), // as string
      hobbies: form.hobbies.map(h => h.value).join(','),     // as string
      password: form.password,
    };

    const { data } = await addEmployee({ variables: { input } });

    if (data?.addEmployee?.message) {
      showSnackbar('Employee created successfully!', 'success');
      setTimeout(() => navigate('/'), 1500);
    }
  } catch (err: any) {
    showSnackbar(err.message || 'Failed to create employee', 'error');
  }
};

  return (
    <div className="create-employee-container">
      <div className="create-employee-header">
        <h2>Create New Employee</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-employee-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
              required
              placeholder="1234567890"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label>Birth Date *</label>
            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
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
            <label>Password *</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Enter password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <small className="password-hint">
              Minimum 8 characters with at least one uppercase, one lowercase, one number and one special character
            </small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Employee description..."
            />
          </div>

          <div className="form-group">
            <label>Education *</label>
            <Select
              isMulti
              options={availableEducations}
              value={form.education}
              onChange={handleEducationChange}
              placeholder="Select education"
              className="multi-select"
              classNamePrefix="select"
              required
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided) => ({
                  ...provided,
                  minHeight: '44px',
                }),
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
              placeholder="Select hobbies"
              className="multi-select"
              classNamePrefix="select"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided) => ({
                  ...provided,
                  minHeight: '44px',
                }),
              }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={mutationLoading}
          >
            {mutationLoading ? 'Creating...' : 'Create Employee'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Createemployee;