import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Updateemployeedetails from "../Updateemployeedetails";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";

// Mock all the external dependencies
jest.mock("axios");
jest.mock("@apollo/client");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Improved mock for react-select with better change event handling
jest.mock("react-select", () => ({
  __esModule: true,
  default: jest.fn(({ options, value, onChange, isMulti }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => ({
          value: option.value,
          label: option.value,
        })
      );
      onChange(isMulti ? selectedOptions : selectedOptions[0]);
    };

    return (
      <select
        data-testid="mock-select"
        multiple={isMulti}
        value={isMulti ? (value || []).map((v: any) => v.value) : value?.value}
        onChange={handleChange}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }),
}));

// Mock MUI components
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Snackbar: jest.fn(({ open, children }) => (open ? children : null)),
  Alert: jest.fn(({ children }) => <div>{children}</div>),
}));

describe("Updateemployeedetails Component", () => {
  const mockNavigate = jest.fn();
  const mockLocation = {
    search: "?id=123",
  };
  const mockUpdateEmployee = jest.fn().mockResolvedValue({
    data: {
      updateEmployee: {
        message: "Employee updated successfully",
      },
    },
  });

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useMutation as jest.Mock).mockReturnValue([
      mockUpdateEmployee,
      { loading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", async () => {
    (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Updateemployeedetails />);

    expect(screen.getByText("Loading employee data...")).toBeDefined();
  });

  it("should fetch and display employee data", async () => {
    const mockEmployeeData = {
      id: 123,
      name: "John Doe",
      phone_no: "1234567890",
      birth_date: "1990-01-01",
      gender: "Male",
      description: "Test description",
      education: ["Bachelor"],
      hobbies: ["Reading"],
    };

    const mockHobbies = [{ name: "Reading" }, { name: "Swimming" }];
    const mockEducations = [{ name: "Bachelor" }, { name: "Master" }];

    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockEmployeeData })
      .mockResolvedValueOnce({ data: mockHobbies })
      .mockResolvedValueOnce({ data: mockEducations });

    await act(async () => {
      render(<Updateemployeedetails />);
    });

    await waitFor(() => {
      // Use getByDisplayValue for inputs without proper labels
      expect(screen.getByDisplayValue("John Doe")).toBeDefined();
      expect(screen.getByDisplayValue("1234567890")).toBeDefined();
      expect(screen.getByDisplayValue("1990-01-01")).toBeDefined();
      expect(screen.getByDisplayValue("Male")).toBeDefined();
      expect(screen.getByDisplayValue("Test description")).toBeDefined();
    });
  });

  it("should update form fields", async () => {
    const mockEmployeeData = {
      id: 123,
      name: "John Doe",
      phone_no: "1234567890",
      birth_date: "1990-01-01",
      gender: "Male",
      description: "Test description",
      education: ["Bachelor"],
      hobbies: ["Reading"],
    };

    const mockHobbies = [{ name: "Reading" }, { name: "Swimming" }];
    const mockEducations = [{ name: "Bachelor" }, { name: "Master" }];

    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockEmployeeData })
      .mockResolvedValueOnce({ data: mockHobbies })
      .mockResolvedValueOnce({ data: mockEducations });

    await act(async () => {
      render(<Updateemployeedetails />);
    });

    // Since inputs don't have proper labels, use getByDisplayValue to find them
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    expect(screen.getByDisplayValue("Jane Doe")).toBeDefined(); // Correct assertion
  });

});
