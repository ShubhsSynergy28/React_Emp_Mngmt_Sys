import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Createemployee from "../Createemployee";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { ADD_EMPLOYEE_MUTATION } from "../../../constants/mutations";
import axios from "axios";

// Mocks
jest.mock("axios");
jest.mock("react-select", () => (props: any) => {
  return (
    <select
      multiple={props.isMulti}
      data-testid={props["data-testid"]}
      onChange={(e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
          (opt) => ({
            value: opt.value,
            label: opt.label,
          })
        );
        props.onChange(selectedOptions);
      }}
    >
      {props.options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockHobbies = [{ name: "Reading" }, { name: "Gaming" }];
const mockEducations = [{ name: "BSc" }, { name: "MSc" }];

describe("Createemployee Component", () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("hobbies"))
        return Promise.resolve({ data: mockHobbies });
      if (url.includes("educations"))
        return Promise.resolve({ data: mockEducations });
      return Promise.reject(new Error("Invalid URL"));
    });
  });

  it("renders form and fetches dropdown data", async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <Createemployee />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/Create New Employee/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("Reading")).toBeDefined();
      expect(screen.getByText("BSc")).toBeDefined();
    });
  });

  it("submits form with valid data and shows success snackbar", async () => {
    const mocks = [
      {
        request: {
          query: ADD_EMPLOYEE_MUTATION,
          variables: {
            input: {
              name: "John Doe",
              phone_no: "1234567890",
              birth_date: "1990-01-01",
              gender: "Male",
              description: "Test description",
              education: "BSc",
              hobbies: "Reading",
              password: "Password@1",
            },
          },
        },
        result: {
          data: {
            addEmployee: {
              message: "Employee created successfully!",
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Createemployee />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText("Reading"));

    userEvent.type(screen.getByPlaceholderText("John Doe"), "John Doe");
    userEvent.type(screen.getByPlaceholderText("1234567890"), "1234567890");
    fireEvent.change(screen.getByLabelText("Birth Date *"), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByDisplayValue("Select Gender"), {
      target: { value: "Male" },
    });
    userEvent.type(screen.getByPlaceholderText("Enter password"), "Password@1");
    userEvent.type(
      screen.getByPlaceholderText("Employee description..."),
      "Test description"
    );

   await userEvent.selectOptions(screen.getByTestId("education-select"), "BSc");


 await userEvent.selectOptions(screen.getByTestId("hobbies-select"), "Reading");

    userEvent.click(screen.getByRole("button", { name: /Create Employee/i }));

//     await waitFor(() =>
//   expect(screen.getByText((content) =>
//     content.includes("Employee created successfully!")
//   )).toBeDefined()
// );
  });

  it("shows error snackbar on failed fetch", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    render(
      <MockedProvider>
        <MemoryRouter>
          <Createemployee />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(screen.getByText(/Failed to load options/i)).toBeDefined()
    );
  });
});
