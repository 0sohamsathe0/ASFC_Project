import React, { useState } from "react";

import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

import axios from "axios";

import "@fontsource/roboto/400.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    event: "",
    aadharCard:"",
    email: "",
    phone: "",
    institute: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
  });

  const [photo, setPhoto] = useState(null);
  const [aadharCardPhoto, setAadharCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("photo", photo);
      data.append("aadharCardPhoto", aadharCardPhoto);

      {/*await axios.post("http://localhost:5000/players/addPlayer", data);*/}

      alert("Player Registered Successfully ✅");
      for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
      console.log("Form Data:", data);
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <h3 className="text-3xl font-bold text-center">
            Fencers Registration Form
          </h3>
          <div className="bg-white flex justify-center p-3 rounded-lg">
            <div className="w-1/4 bg-gray-900 h-screen "></div>
            <form
              action="/"
              onSubmit={handleSubmit}
              className="w-3/4  h-full p-5"
            >
              <Paper elevation={4} sx={{ p: 4 }}>
                <h1 className="text-xl font-semibold text-center text-amber-200">
                  Personal Details
                </h1>
                <br />
                <label
                  className="block mb-3 text-sm font-medium text-gray-700"
                  htmlFor="fullName"
                >
                  Name (as should be on certificate)
                </label>
                <TextField
                  label="Enter Full Name"
                  name="fullName"
                  fullWidth
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <div className="flex gap-5 mt-5 ">
                  <label
                    className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                    htmlFor="gender"
                  >
                    Gender :
                  </label>
                  <TextField
                    className="w-1/4"
                    select
                    label="gender"
                    name="gender"
                    required
                    size="small"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>

                  <label htmlFor="dob">Date of Birth</label>
                  <TextField
                    className="w-1/4"
                    type="date"
                    name="dob"
                    size="small"
                    label="Date of Birth"
                    InputLabelProps={{ shrink: true }}
                    required
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                <label
                  htmlFor="event"
                  className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                >
                  Event :{" "}
                </label>
                <TextField
                  select
                  label="Event"
                  name="event"
                  fullWidth
                  value={formData.event}
                  onChange={handleChange}
                >
                  <MenuItem value="Epee">Epee</MenuItem>
                  <MenuItem value="Foil">Foil</MenuItem>
                  <MenuItem value="Sabre">Sabre</MenuItem>
                </TextField>
                <label
                  className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <label
                  className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />

                <label
                  className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                  htmlFor="aadharCardNumber"
                >
                  Aadhar Card Number :
                </label>
                <TextField
                  label="Aadhar Card Number"
                  name="aadharCardNumber"
                  fullWidth
                  required
                  value={formData.aadharCardNumber}
                  onChange={handleChange}
                />

                <label
                  className="block mb-3 mt-3 x text-sm font-medium text-gray-700"
                  htmlFor="institute"
                >
                  Institute / School / College Name :
                </label>
                <TextField
                  label="Institute / School / College"
                  name="institute"
                  fullWidth
                  required
                  value={formData.institute}
                  onChange={handleChange}
                />
              </Paper>

              <br />
              <br />
              <Paper elevation={4} sx={{ p: 4 }}>
                  <h1 className="text-xl font-semibold text-center text-amber-200">
                  Address Details
                </h1>
                <br />
                <Grid item xs={12}>
                  <label htmlFor="addressLine1" className="block mb-3 mt-3 x text-sm font-medium text-gray-700">Address Line 1</label>
                <TextField
                  label="Address Line 1"
                  name="addressLine1"
                  fullWidth
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <label htmlFor="addressLine2" className="block mb-3 mt-3 x text-sm font-medium text-gray-700">Address Line 2</label>
                <TextField
                  label="Address Line 2"
                  name="addressLine2"
                  fullWidth
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <label htmlFor="pincode" className="block mb-3 mt-3 x text-sm font-medium text-gray-700">Pincode</label>
                <TextField
                  label="Pincode"
                  name="pincode"
                  fullWidth
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Grid>
              </Paper>

              <Paper elevation={4} sx={{ p: 4, mt: 5 }}> 
                <h1 className="text-xl font-semibold text-center text-amber-200">
                  Upload Documents
                </h1>

              <Grid item xs={12} md={6}>
                <label htmlFor="photo">Upload Player Photo : </label>
                <Button variant="contained" component="label" >
                  Upload photo
                  <input
                  name="photo"
                    type="file"
                    hidden
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <label htmlFor="aadharCardPhoto">Upload Aadhaar Card : </label>
                <Button variant="contained" component="label">
                  Upload Aadhaar
                  <input
                  name="aadharCardPhoto"
                    type="file"
                    hidden
                    onChange={(e) => setAadharCardPhoto(e.target.files[0])}
                  />
                </Button>
              </Grid>
              </Paper>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Player"}
                </Button>
              </Grid>

            </form>
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default RegistrationForm;
