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

import axios from "axios";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "../validations/playerSchema.js";
import "@fontsource/roboto/400.css";

function RegistrationForm() {

  const [photo, setPhoto] = useState(null);
  const [aadharCardPhoto, setAadharCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setServerError("");
      setSuccessMessage("");
      setUploadProgress(0);
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
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
      data.append(
        "aadharCardPhoto",
        aadharCardPhoto
      );

      const response = await axios.post(
        "http://localhost:5050/player/add",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        }
      );
      setSuccessMessage(response.data.message);
      reset();
      setPhoto(null);
      setAadharCardPhoto(null);
    }
    catch (error) {
      console.log(error);
      if (error.response) {
        const status = error.response.status;

        const message = error.response.data.message;
        if (status === 409) {
          setError(
            "aadharCard",
            {
              type: "server",
              message
            }
          );
        }
        else {
          setServerError(message);
        }
      }
      else if (error.code === "ERR_NETWORK") {
        setServerError("No internet connection");
      }
      else {
        setServerError("Something went wrong");
      }

    }
    finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ mt: 4, mb: 4 }}
      >
        <Paper
          elevation={4}
          sx={{ p: 4 }}
        >
          <h3 className="text-3xl font-bold text-center">
            Fencers Registration
            Form
          </h3>

          <div className="bg-white flex justify-center p-3 rounded-lg">

            <div className="w-1/4 bg-gray-900 h-screen"></div>

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="w-3/4 h-full p-5"
            >
              {/* PERSONAL */}

              <Paper
                elevation={4}
                sx={{ p: 4 }}
              >
                <h1 className="text-xl font-semibold text-center text-amber-200">
                  Personal Details
                </h1>

                <br />

                <TextField
                  label="Enter Full Name"
                  fullWidth
                  {...register(
                    "fullName"
                  )}
                  error={
                    !!errors.fullName
                  }
                  helperText={
                    errors.fullName
                      ?.message
                  }
                />

                <div className="flex gap-5 mt-5">

                  <TextField
                    className="w-1/4"
                    select
                    label="Gender"
                    size="small"
                    {...register(
                      "gender"
                    )}
                    error={
                      !!errors.gender
                    }
                    helperText={
                      errors.gender
                        ?.message
                    }
                  >
                    <MenuItem value="Male">
                      Male
                    </MenuItem>

                    <MenuItem value="Female">
                      Female
                    </MenuItem>

                  </TextField>

                  <TextField
                    className="w-1/4"
                    type="date"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register(
                      "dob"
                    )}
                    error={
                      !!errors.dob
                    }
                    helperText={
                      errors.dob
                        ?.message
                    }
                  />
                </div>

                <br />

                <TextField
                  select
                  label="Event"
                  fullWidth
                  {...register(
                    "event"
                  )}
                  error={
                    !!errors.event
                  }
                  helperText={
                    errors.event
                      ?.message
                  }
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

                <br /><br />

                <TextField
                  label="Email"
                  fullWidth
                  {...register(
                    "email"
                  )}
                  error={
                    !!errors.email
                  }
                  helperText={
                    errors.email
                      ?.message
                  }
                />

                <br /><br />

                <TextField
                  label="Phone"
                  fullWidth
                  {...register(
                    "phone"
                  )}
                  error={
                    !!errors.phone
                  }
                  helperText={
                    errors.phone
                      ?.message
                  }
                />

                <br /><br />

                <TextField
                  label="Aadhar Card"
                  fullWidth
                  {...register(
                    "aadharCard"
                  )}
                  error={
                    !!errors.aadharCard
                  }
                  helperText={
                    errors.aadharCard
                      ?.message
                  }
                />

                <br /><br />

                <TextField
                  label="Institute"
                  fullWidth
                  {...register(
                    "institute"
                  )}
                  error={
                    !!errors.institute
                  }
                  helperText={
                    errors.institute
                      ?.message
                  }
                />
              </Paper>

              <br />

              {/* ADDRESS */}

              <Paper
                elevation={4}
                sx={{ p: 4 }}
              >
                <h1 className="text-xl font-semibold text-center text-amber-200">
                  Address Details
                </h1>

                <br />

                <TextField
                  label="Address Line 1"
                  fullWidth
                  {...register(
                    "addressLine1"
                  )}
                  error={
                    !!errors.addressLine1
                  }
                  helperText={
                    errors.addressLine1
                      ?.message
                  }
                />

                <br /><br />

                <TextField
                  label="Address Line 2"
                  fullWidth
                  {...register(
                    "addressLine2"
                  )}
                />

                <br /><br />

                <TextField
                  label="Pincode"
                  fullWidth
                  {...register(
                    "pincode"
                  )}
                  error={
                    !!errors.pincode
                  }
                  helperText={
                    errors.pincode
                      ?.message
                  }
                />
              </Paper>

              <br />

              {/* UPLOAD */}

              <Paper
                elevation={4}
                sx={{ p: 4 }}
              >
                <h1 className="text-xl font-semibold text-center text-amber-200">
                  Upload Documents
                </h1>

                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={6}
                  >
                    <Button
                      variant="contained"
                      component="label"
                    >
                      Upload Photo

                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setPhoto(
                            e.target
                              .files[0]
                          )
                        }
                      />
                    </Button>

                    {photo && (
                      <p className="mt-2">
                        {
                          photo.name
                        }
                      </p>
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={6}
                  >
                    <Button
                      variant="contained"
                      component="label"
                    >
                      Upload Aadhaar

                      <input
                        hidden
                        type="file"
                        onChange={(e) =>
                          setAadharCardPhoto(
                            e.target
                              .files[0]
                          )
                        }
                      />
                    </Button>

                    {aadharCardPhoto && (
                      <p className="mt-2">
                        {
                          aadharCardPhoto.name
                        }
                      </p>
                    )}
                  </Grid>
                </Grid>

                {loading &&
                  uploadProgress >
                  0 && (
                    <>
                      <p className="mt-4">
                        Uploading:
                        {" "}
                        {
                          uploadProgress
                        }
                        %
                      </p>

                      <LinearProgress
                        variant="determinate"
                        value={
                          uploadProgress
                        }
                      />
                    </>
                  )}
              </Paper>

              <Collapse in={!!serverError}>
                {serverError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 3,
                      borderRadius: "10px"
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
                      fontSize: "16px",
                      borderRadius: "10px"
                    }}
                  >
                    {successMessage}
                  </Alert>
                )}
              </Collapse>

              <br />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={
                  loading
                }
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        color:
                          "white",
                        mr: 1,
                      }}
                    />

                    Registering...
                  </>
                ) : (
                  "Register Player"
                )}
              </Button>
            </form>
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default RegistrationForm;