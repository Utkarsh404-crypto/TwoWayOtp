import React, { useState } from "react";
import axios from "axios";
import "./form.css";

function Form() {
	const [contactNumber, setContactNumber] = useState();
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const config = {
				headers: {
					"Content-type": "application/json"
				}
			};
			const { data } = await axios.post(
				"http://127.0.0.1:8080/api/getOtp/generateAndSendOTP",
				{ contactNumber },
				config
			);
		} catch (error) {
			alert("error", error.message);
		}
	};

	return (
		<>
			<div className="container">
				<div class="form-container">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<input
								type="number"
								placeholder="Contact Number"
								className="form-control"
								value={contactNumber}
								onChange={(e) => setContactNumber(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<input
								type="email"
								placeholder="Email"
								className="form-control"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							onClick={handleSubmit}>
							Get OTP
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default Form;
