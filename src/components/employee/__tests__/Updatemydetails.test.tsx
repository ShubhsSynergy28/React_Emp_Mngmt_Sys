import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Updatemydetails from "../Updatemydetails";
import { GET_EMPLOYEE_BY_ID } from "../../../constants/query";
import { UPDATE_EMPLOYEE } from "../../../constants/mutations";
import axios from "axios";

// Mock navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Set sessionStorage before each test
beforeEach(() => {
  sessionStorage.setItem("employee_id", "emp123");
});

// Mocks
const hobbies = [{ name: "Reading" }, { name: "Coding" }];
const educations = [{ name: "B.Tech" }, { name: "M.Tech" }];
const employee = {
  getEmployeebyId: {
    EName: "Alice",
    Ephone: "1234567890",
    Ebirth_date: "1990-01-01",
    Egender: "Female",
    Edescription: "Engineer",
    hobbies: ["Reading"],
    educations: ["B.Tech"],
  },
};

const updateResponse = {
  updateEmployee: {
    message: "Update successful",
  },
};

// Apollo mocks
const mocks = [
  {
    request: {
      query: GET_EMPLOYEE_BY_ID,
      variables: { getEmployeebyIdId: "emp123" },
    },
    result: { data: employee },
  },
  {
    request: {
      query: UPDATE_EMPLOYEE,
      variables: {
        updateEmployeeId: "emp123",
        input: {
          name: "Alice",
          phone_no: "1234567890",
          birth_date: "1990-01-01",
          gender: "Female",
          description: "Engineer",
          education: "B.Tech",
          hobbies: "Reading",
        },
      },
    },
    result: { data: updateResponse },
  },
];

describe("Updatemydetails Component", () => {
  it("renders loading state initially", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: hobbies });
    mockedAxios.get.mockResolvedValueOnce({ data: educations });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Updatemydetails />
      </MockedProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });

  it("renders form after data loads", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: hobbies });
    mockedAxios.get.mockResolvedValueOnce({ data: educations });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Updatemydetails />
      </MockedProvider>
    );

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
expect(nameInput.value).toBe("Alice");

const phoneInput = screen.getByPlaceholderText("Phone Number") as HTMLInputElement;
expect(phoneInput.value).toBe("1234567890");
    });
  });

  it("shows success snackbar on successful update", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: hobbies });
    mockedAxios.get.mockResolvedValueOnce({ data: educations });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Updatemydetails />
      </MockedProvider>
    );

    // Wait for form to be filled
    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeDefined();
    });

    // Submit form
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Update successful")).toBeDefined();
    });
  });

  it("shows error snackbar on update failure", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: hobbies });
    mockedAxios.get.mockResolvedValueOnce({ data: educations });

    const errorMocks = [
      {
        request: {
          query: GET_EMPLOYEE_BY_ID,
          variables: { getEmployeebyIdId: "emp123" },
        },
        result: { data: employee },
      },
      {
        request: {
          query: UPDATE_EMPLOYEE,
          variables: expect.anything(),
        },
        error: new Error("Update failed"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Updatemydetails />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Failed to update details.")).toBeDefined();
    });
  });
});
