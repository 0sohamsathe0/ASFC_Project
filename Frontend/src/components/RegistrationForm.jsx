import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "../validations/playerSchema.js";
import "@fontsource/roboto/400.css";
import { api } from "./api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";



function RegistrationForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [aadharCardPhoto, setAadharCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoError, setPhotoError] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playerSchema),

    defaultValues: {
      fullName: "",
      gender: "",
      dob: "",
      event: "",
      aadharCard: "",
      email: "",
      phone: "",
      institute: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const PHOTO_TYPES = [
    "image/jpeg",
    "image/png",
  ];

  const AADHAAR_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    const error = validateFile(file, PHOTO_TYPES);

    if (error) {
      setPhotoError(error);
      e.target.value = "";
      setPhoto(null);
      return;
    }

    setPhotoError("");
    setPhoto(file);
  };

  const handleAadhaarChange = (e) => {
    const file = e.target.files?.[0];

    const error = validateFile(file, AADHAAR_TYPES);

    if (error) {
      setAadhaarError(error);
      e.target.value = "";
      setAadharCardPhoto(null);
      return;
    }

    setAadhaarError("");
    setAadharCardPhoto(file);
  };

  const validateFile = (file, allowedTypes) => {
    if (!file) {
      return "Please select a file.";
    }

    if (file.size === 0) {
      return "Selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5 MB.";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type.";
    }

    return null;
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setServerError("");
      setSuccessMessage("");
      setUploadProgress(0);

      if (!photo) {
        setServerError("Upload player photo");
        return;
      }

      if (!aadharCardPhoto) {
        setServerError("Upload Aadhaar card");
        return;
      }

      if (photo.size > MAX_FILE_SIZE) {
        setServerError("Photo must be below 5MB");
        return;
      }

      if (aadharCardPhoto.size > MAX_FILE_SIZE) {
        setServerError("Aadhaar file must be below 5MB");
        return;
      }

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("photo", photo);
      data.append("aadharCardPhoto", aadharCardPhoto);

      const response = await api.post(
        "player/add",
        data,
        {
          onUploadProgress: ({ loaded, total }) => {
            if (!total) return;
            setUploadProgress(Math.round((loaded * 100) / total));
          }
        }
      );

      login(response.data.user);

      reset();
      setPhoto(null);
      setAadharCardPhoto(null);
      setPhotoError("");
      setAadhaarError("");
      navigate("/player/profile");
    } catch (error) {
      console.log("ERROR:", error);

      if (error.response) {
        console.log("Response:", error.response);

        const status = error.response.status;
        const message = error.response.data.message;

        if (status === 409) {
          setError("aadharCard", {
            type: "server",
            message,
          });
        } else {
          setServerError(`${status}: ${message}`);
        }
      } else if (error.request) {
        console.log("Request:", error.request);
        setServerError("Request sent but no response received.");
      } else {
        console.log("Message:", error.message);
        setServerError(error.message);
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 2,
          md: 5,
        },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          overflow: "hidden",
          borderRadius: "24px",
        }}
      >
        <div className="flex flex-col lg:flex-row min-h-screen">

          {/* ================= LEFT PANEL ================= */}

          <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden rounded-l-[32px]">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950"></div>

            {/* Decorative Glow */}

            <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>

            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"></div>

            {/* Content */}

            <div className="relative z-10 flex flex-col justify-between h-full p-12">

              {/* ================= TOP ================= */}

              <div>

                <p className="text-blue-400 text-sm font-semibold tracking-[0.35em] uppercase">
                  Welcome To
                </p>

                <h1 className="mt-4 text-6xl font-black leading-tight text-white">
                  All Star
                  <br />
                  Fencing Club
                </h1>

                <div className="mt-6 h-1 w-24 rounded-full bg-blue-500"></div>

                <p className="mt-8 text-lg leading-8 text-gray-300">
                  Become a part of Solapur's growing fencing community.
                  Register today and begin your journey with professional
                  coaching, tournaments and competitive excellence.
                </p>

                {/* Features */}

                <div className="mt-10 space-y-5">

                  {[
                    "Professional Coaching",
                    "State & National Competitions",
                    "Official Player Registration",
                    "Performance Tracking",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-4"
                    >

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg">

                        <span className="text-lg font-bold text-white">
                          ✓
                        </span>

                      </div>

                      <span className="text-lg text-white">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

              {/* ================= REGISTRATION JOURNEY ================= */}

              <div className="my-12">

                <div className="flex items-center gap-3 mb-8">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">

                    <span className="text-2xl text-white">
                      ⚔
                    </span>

                  </div>

                  <div>

                    <h2 className="text-2xl font-bold text-white">
                      Registration Journey
                    </h2>

                    <p className="text-gray-400">
                      Complete four simple steps.
                    </p>

                  </div>

                </div>

                <div className="relative ml-5">

                  {/* Timeline */}

                  <div className="absolute left-4 top-5 bottom-5 w-[2px] bg-blue-500/40"></div>

                  {[
                    {
                      number: "01",
                      title: "Fill Registration",
                      desc: "Complete the registration form with accurate information.",
                    },
                    {
                      number: "02",
                      title: "Admin Verification",
                      desc: "Our team verifies your submitted details and documents.",
                    },
                    {
                      number: "03",
                      title: "Player Approval",
                      desc: "Your player account is approved by the club.",
                    },
                    {
                      number: "04",
                      title: "Start Training",
                      desc: "Join coaching sessions and compete in tournaments.",
                    },
                  ].map((step) => (

                    <div
                      key={step.number}
                      className="relative flex gap-5 pb-8 last:pb-0"
                    >

                      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-900 bg-blue-600 text-sm font-bold text-white shadow-lg">

                        {step.number}

                      </div>

                      <div>

                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>

                        <p className="mt-1 max-w-xs text-sm leading-6 text-gray-400">
                          {step.desc}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* ================= BOTTOM ================= */}

              <div>

                {/* Stats */}

                <div className="grid grid-cols-3 gap-4">

                  {[
                    {
                      value: "250+",
                      label: "Players",
                    },
                    {
                      value: "40+",
                      label: "Medals",
                    },
                    {
                      value: "10+",
                      label: "Years",
                    },
                  ].map((stat) => (

                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                    >

                      <h3 className="text-4xl font-bold text-white">
                        {stat.value}
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        {stat.label}
                      </p>

                    </div>

                  ))}

                </div>

                {/* Quote */}

                <div className="mt-10 border-l-4 border-blue-500 pl-5">

                  <p className="text-xl italic text-gray-200">
                    "Discipline. Dedication. Victory."
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    — All Star Fencing Club
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="flex-1 bg-gray-50">

            {/* Mobile Header */}

            <div className="lg:hidden bg-gray-900 text-white px-6 py-8">

              <h1 className="text-3xl font-bold">
                All Star Fencing Club
              </h1>

              <p className="text-gray-300 mt-2">
                Player Registration
              </p>

            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 sm:p-6 md:p-8 lg:p-10"
            >

              <div className="mb-10">

                <h2 className="text-3xl font-bold text-gray-900">
                  Player Registration
                </h2>

                <p className="text-gray-500 mt-2">
                  Please fill all the details carefully.
                </p>

              </div>

              {/* ================= PERSONAL DETAILS ================= */}

              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  mb: 4,
                }}
              >

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-gray-800">
                    Personal Details
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Enter the player's personal information.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Full Name */}

                  <TextField
                    label="Full Name"
                    fullWidth
                    {...register("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />

                  {/* Aadhaar */}

                  <TextField
                    label="Aadhaar Number"
                    fullWidth
                    {...register("aadharCard")}
                    error={!!errors.aadharCard}
                    helperText={errors.aadharCard?.message}
                  />

                  {/* Gender */}

                  <TextField
                    select
                    label="Gender"
                    fullWidth
                    {...register("gender")}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="Male">
                      Male
                    </MenuItem>

                    <MenuItem value="Female">
                      Female
                    </MenuItem>
                  </TextField>

                  {/* DOB */}

                  <TextField
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("dob")}
                    error={!!errors.dob}
                    helperText={errors.dob?.message}
                  />

                  {/* Event */}

                  <TextField
                    select
                    label="Weapon"
                    fullWidth
                    {...register("event")}
                    error={!!errors.event}
                    helperText={errors.event?.message}
                  >
                    <MenuItem value="Epee">
                      Epee
                    </MenuItem>

                    <MenuItem value="Foil">
                      Foil
                    </MenuItem>

                    <MenuItem value="Sabre">
                      Sabre
                    </MenuItem>
                  </TextField>

                  {/* Phone */}

                  <TextField
                    label="Phone Number"
                    fullWidth
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />

                </div>

                {/* Email */}

                <div className="mt-5">

                  <TextField
                    label="Email Address"
                    fullWidth
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                </div>

                {/* Institute */}

                <div className="mt-5">

                  <TextField
                    label="School / College / Institute"
                    fullWidth
                    {...register("institute")}
                    error={!!errors.institute}
                    helperText={errors.institute?.message}
                  />

                </div>

              </Paper>
              {/* ================= ADDRESS DETAILS ================= */}

              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  mb: 4,
                }}
              >

                {/* Section Header */}

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-gray-800">
                    Address Details
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Enter your residential address.
                  </p>

                </div>

                <div className="space-y-5">

                  {/* Address Line 1 */}

                  <TextField
                    label="Address Line 1"
                    placeholder="House No., Building, Street"
                    fullWidth
                    {...register("addressLine1")}
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                  />

                  {/* Address Line 2 */}

                  <TextField
                    label="Address Line 2"
                    placeholder="Area, Landmark (Optional)"
                    fullWidth
                    {...register("addressLine2")}
                  />

                  {/* Pincode */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <TextField
                      label="Pincode"
                      fullWidth
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={errors.pincode?.message}
                    />

                    {/* Empty space on desktop for better balance */}

                    <div className="hidden md:block"></div>

                  </div>

                </div>

              </Paper>
              {/* ================= UPLOAD DOCUMENTS ================= */}

              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  mb: 4,
                }}
              >

                {/* Header */}

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-gray-800">
                    Upload Documents
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Upload a passport-size photo and your Aadhaar card.
                    Maximum file size: 5 MB.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Player Photo */}

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-blue-500 transition">

                    <div className="text-5xl mb-4">
                      📷
                    </div>

                    <h4 className="font-semibold text-lg">
                      Player Photo
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      JPG, JPEG or PNG
                    </p>

                    <p className="text-xs text-gray-400 mb-5">
                      Maximum file size: 5 MB
                    </p>

                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      disabled={loading}
                    >
                      Choose Photo

                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={handlePhotoChange}
                      />

                    </Button>

                    {photo && (

                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">

                        <p className="text-sm font-medium text-green-700 truncate">
                          ✓ {photo.name}
                        </p>

                        <p className="text-xs text-green-600 mt-1">
                          {(photo.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                      </div>

                    )}
                    {photoError && (
                      <p className="mt-2 text-sm text-red-600">
                        {photoError}
                      </p>
                    )}

                  </div>

                  {/* Aadhaar Card */}

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-blue-500 transition">

                    <div className="text-5xl mb-4">
                      🪪
                    </div>

                    <h4 className="font-semibold text-lg">
                      Aadhaar Card
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      JPG, JPEG, PNG or PDF
                    </p>

                    <p className="text-xs text-gray-400 mb-5">
                      Maximum file size: 5 MB
                    </p>

                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      disabled={loading}
                    >
                      Choose File

                      <input
                        hidden
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        disabled={loading}
                        onChange={handleAadhaarChange}
                      />

                    </Button>

                    {aadharCardPhoto && (

                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">

                        <p className="text-sm font-medium text-green-700 truncate">
                          ✓ {aadharCardPhoto.name}
                        </p>

                        <p className="text-xs text-green-600 mt-1">
                          {(aadharCardPhoto.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                      </div>

                    )}
                    {aadhaarError && (
                      <p className="mt-2 text-sm text-red-600">
                        {aadhaarError}
                      </p>
                    )}

                  </div>

                </div>

                {/* Upload Progress */}

                {loading && uploadProgress > 0 && (

                  <div className="mt-8">

                    <div className="flex justify-between text-sm font-medium mb-2">

                      <span>
                        Uploading Files...
                      </span>

                      <span>
                        {uploadProgress}%
                      </span>

                    </div>

                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                      }}
                    />

                  </div>

                )}

              </Paper>
              {/* ================= ALERTS ================= */}

              <Collapse in={!!serverError}>
                {serverError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 3,
                      borderRadius: "14px",
                      fontSize: "15px",
                    }}
                  >
                    {serverError}
                  </Alert>
                )}
              </Collapse>

              <Collapse in={!!successMessage}>
                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 3,
                      borderRadius: "14px",
                      fontSize: "15px",
                    }}
                  >
                    {successMessage}
                  </Alert>
                )}
              </Collapse>

              {/* ================= SUBMIT BUTTON ================= */}

              <div className="sticky bottom-0 bg-gray-50 pt-6 pb-2 mt-8">

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={22}
                        sx={{
                          color: "#fff",
                          mr: 1.5,
                        }}
                      />

                      Registering Player...
                    </>
                  ) : (
                    "Register Player"
                  )}
                </Button>

              </div>
            </form>

          </div>

        </div>

      </Paper>

    </Container>

  );
}

export default RegistrationForm;