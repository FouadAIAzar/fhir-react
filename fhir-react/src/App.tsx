import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
    const [output, setOutput] = useState<any[]>([]);

    const createPatient = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        // Create a FHIR Patient resource
        const patient = {
            resourceType: "Patient",
            name: [
                {
                    family: formData.get("lastName"),
                    given: [formData.get("firstName")],
                },
            ],
            birthDate: formData.get("dob"),
        };

        // Connect to Backend Server and send the Patient resource
        try {
            const response = await axios.post("http://localhost:8080/create-patient", patient);
            setOutput([response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const retrievePatient = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const patientId = formData.get("patientId");

        try {
            const response = await axios.get(`http://localhost:8080/retrieve-patient/${patientId}`);
            setOutput([response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const displayTable = (data: any[]) => (
        <table>
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) =>
                    Object.entries(item).map(([key, value]) => (
                        <tr key={`${index}-${key}`}>
                            <td>{key}</td>
                            <td>{typeof value === "object" ? JSON.stringify(value) : String(value)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    return (
        <div className="App">
            <h1>FHIR Patient Management</h1>

            {/* Create Patient */}
            <section>
                <h2>Create Patient</h2>
                <form onSubmit={createPatient}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" required />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input type="text" name="lastName" required />
                    </label>
                    <br />
                    <label>
                        Date of Birth:
                        <input type="date" name="dob" required />
                    </label>
                    <br />
                    <button type="submit">Create Patient</button>
                </form>
            </section>

            {/* Retrieve Patient */}
            <section>
                <h2>Retrieve Patient</h2>
                <form onSubmit={retrievePatient}>
                    <label>
                        Patient ID:
                        <input type="text" name="patientId" required />
                    </label>
                    <br />
                    <button type="submit">Retrieve Patient</button>
                </form>
            </section>

            {/* Output Section */}
            <section>
                <h2>Output</h2>
                {output.length > 0 ? displayTable(output) : <p>No data to display</p>}
            </section>
        </div>
    );
};

export default App;
