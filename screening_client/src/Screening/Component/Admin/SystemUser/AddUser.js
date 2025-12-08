import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import "./AddUser.css";
import {
  DriveFileRenameOutlineOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { Modal } from "react-bootstrap";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  FormControl,
  InputLabel,
  DeleteOutlineOutlinedIcon,
  Alert,
  Snackbar,
} from "@mui/material";
import { API_URL } from "../../../../Config/api";

const AddUser = () => {
  //permission code start
  const [canAddUser, setCanAddUser] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    console.log("Stored Permissions:", storedPermissions);
    const parsedPermissions = storedPermissions
      ? JSON.parse(storedPermissions)
      : [];
    console.log("parsedPermissions Permissions:", parsedPermissions);
    // Check if the user has permission to add a citizen with 'Edit' submodule
    const hasAddCitizenPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "System User" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Add")
      )
    );
    setCanAddUser(hasAddCitizenPermission);
    // Check if the user has permission for the "Delete" submodule
    const hasDeletePermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "System User" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Delete")
      )
    );
    setCanDelete(hasDeletePermission);

    // Check if the user has permission for the "edit" submodule
    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "System User" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Edit")
      )
    );
    setCanEdit(hasEditPermission);

    // Check if the user has permission for the "edit" submodule
    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "System User" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "View")
      )
    );
    setCanView(hasViewPermission);
  }, []);

  //permission code end
  // const API_URL = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [showForm, setShowForm] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const [gender, setGender] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Open Snackbar Helper
  const showSnackbar = (msg, type = "error") => {
    setSnackbar({
      open: true,
      message: msg,
      severity: type,
    });
  };

  ///////////////////// Navbar
  /// State District Tehsil
  const State = localStorage.getItem("StateLogin");
  const District = localStorage.getItem("DistrictLogin");
  const Tehsil = localStorage.getItem("TehsilLogin");

  const userID = localStorage.getItem("userID");

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  // console.log(userID);

  const [sourceOptionNav, setSourceOptionNav] = useState([]);
  const [selectedSourceeNav, setSelectedSourceeNav] = useState(
    SourceUrlId || ""
  );

  const [stateOptionsNav, setStateOptionsNav] = useState([]);
  const [selectedStateNav, setSelectedStateNav] = useState(State || "");

  const [districtOptionsNav, setDistrictOptionsNav] = useState([]);
  const [selectedDistrictNav, setSelectedDistrictNav] = useState(
    District || ""
  );

  const [talukaOptionsNav, setTalukaOptionsNav] = useState([]);
  const [selectedTalukaNav, setSelectedTalukaNav] = useState(Tehsil || "");

  const [sourceNameOptionsNav, setSourceNameNav] = useState([]);
  const [selectedNameNav, setSelectedNameNav] = useState("");

  //////////////// form state district tehsil and source name useState
  const [sourceOption, setSourceOption] = useState([]);
  const [selectedSourcee, setSelectedSourcee] = useState("");

  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [talukaOptions, setTalukaOptions] = useState([]);
  const [selectedTaluka, setSelectedTaluka] = useState("");

  const [sourceNameOptions, setSourceNameOptions] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  const [roleForm, setRoleForm] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [updateSrc, setUpdateSrc] = useState(true); /////////// update user form
  const [deleteSrc, setDeleteSrc] = useState(true); ///////delete user
  const [deleteModel, setDeleteModel] = useState(false); /////// model Delete
  const [showModal, setShowModal] = useState(false); /////// model Registered
  const [mandotoryModel, setMandotoryModel] = useState(false); ////////////// Mandotory Fields
  const [updateModel, setUpdateModel] = useState(false); ////////////// Mandotory Fields
  const [existModel, setExistModel] = useState(false); ////////////// ExistFields
  const [formEnabled, setFormEnabled] = useState(false); ////////// disabled
  const [loading, setLoading] = useState(true);

  ////////////// navbar useState
  useEffect(() => {
    // Fetch source options
    axios
      .get(`${API_URL}/Screening/source_GET/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setSourceOptionNav(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sources:", error);
      });
  }, []);

  //// Soure State against selected source
  useEffect(() => {
    axios
      .get(`${API_URL}/Screening/State_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setStateOptionsNav(response.data);
      })
      .catch((error) => {
        console.error("Error while fetching state data:", error);
      });
  }, []);

  //// Soure District against selected source state
  useEffect(() => {
    if (selectedStateNav) {
      axios
        .get(`${API_URL}/Screening/District_Get/${selectedStateNav}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setDistrictOptionsNav(response.data);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedStateNav]);

  //// Soure Taluka against selected source district
  useEffect(() => {
    if (selectedDistrictNav) {
      axios
        .get(`${API_URL}/Screening/Tehsil_Get/${selectedDistrictNav}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setTalukaOptionsNav(response.data);
        })
        .catch((error) => {
          console.error("Error fetching taluka data:", error);
        });
    }
  }, [selectedDistrictNav]);

  //// Soure Name against selected source Taluka
  useEffect(() => {
    if (selectedTalukaNav) {
      axios
        .get(`${API_URL}/Screening/Workshop_list_get/${selectedTalukaNav}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setSourceNameNav(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching Source Name against Taluka data:",
            error
          );
        });
    }
  }, [selectedTalukaNav]);

  ////////////// modal Registered
  const handleRegisterModel = () => {
    setShowModal(false);
  };

  ////////////// Delete Model
  const handleDeleteModel = () => {
    setDeleteModel(false);
  };

  ////////////// Mandotory Model
  const handleMandotoryModel = () => {
    setMandotoryModel(false);
  };

  ////////////// Mandotory Model
  const handleUpdateModel = () => {
    setUpdateModel(false);
  };

  ////////////// Exist Model
  const handleExistModel = () => {
    setExistModel(false);
  };

  ////////////////////////// Form value dropdown get ///////////////////////////////

  useEffect(() => {
    // Fetch source options
    axios
      .get(`${API_URL}/Screening/Source_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setSourceOption(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sources:", error);
      });
  }, []);

  //// Soure State against selected source
  useEffect(() => {
    axios
      .get(`${API_URL}/Screening/State_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setStateOptions(response.data);
      })
      .catch((error) => {
        console.log("Error while fetching state data:", error);
      });
  }, []); // <-- empty dependency: executes immediately on mount

  //// Soure District against selected source state
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${API_URL}/Screening/District_Get/${selectedState}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setDistrictOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching districts against state data:", error);
        });
    }
  }, [selectedState]);

  //// Soure Taluka against selected source district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`${API_URL}/Screening/Tehsil_Get/${selectedDistrict}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setTalukaOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching taluka data:", error);
        });
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTaluka) {
      axios
        .get(`${API_URL}/Screening/Workshop_list_get/${selectedTaluka}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setSourceNameOptions(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching Source Name against Taluka data:",
            error
          );
        });
    }
  }, [selectedTaluka]);

  //// Soure Name against selected source Taluka
  useEffect(() => {
    axios
      .get(`${API_URL}/Screening/Source_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setSourceNameOptions(response.data); // ← use your state setter here
      })
      .catch((error) => {
        console.error("Error fetching Source_Get data:", error);
      });
  }, []); // <-- direct call, no dependency

  /////////// role
  useEffect(() => {
    if (selectedSourcee) {
      axios
        .get(`${API_URL}/Screening/agg_role_info_get/${selectedSourcee}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setRoleForm(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching Source Name against Taluka data:",
            error
          );
        });
    }
  }, [selectedSourcee]);

  /////////////////// completed
  //// Table Get
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Screening/User_GET/?clg_source=${SourceUrlId}&clg_source_name_id=${SourceNameUrlId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTableData(response.data);
        // console.log(tableData);
        setLoading(false);
      } catch (error) {
        console.log("Error Fetching Data", error);
        setLoading(false);
      }
    };
    fetchTable();
  }, []);

  //// Gender Get Dropdown
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await axios.get(`${API_URL}/Screening/Gender_GET/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGender(response.data);
        console.log(gender);
      } catch (error) {
        console.log("Error Fetching Gender", error);
      }
    };
    fetchGender();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setTransitioning(true);

    setTimeout(() => {
      setTransitioning(false);
    }, 400);
  };

  const [formData, setFormData] = useState({
    clg_ref_id: "",
    clg_gender: "",
    clg_Date_of_birth: "",
    clg_mobile_no: "",
    clg_email: "",
    clg_address: "",
    password: "1234",
    password2: "1234",
    pk: "",
    clg_source_id: "",
    clg_states_id: "",
    clg_district_id: "",
    clg_tehsil_id: "",
    clg_source_name_id: "",
    clg_grppp_id: "",
    clg_genderr_id: "",
  });

  const resetForm = () => {
    setFormData({
      clg_ref_id: "",
      clg_gender: "",
      clg_Date_of_birth: "",
      clg_mobile_no: "",
      clg_email: "",
      clg_address: "",
      password: "1234",
      password2: "1234",
      pk: "",
      clg_source_id: "",
      clg_states_id: "",
      clg_district_id: "",
      clg_tehsil_id: "",
      clg_source_name_id: "",
      grp_id: "",
    });

    setSelectedSourcee("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTaluka("");
    setSelectedName("");
    setSelectedRole("");

    setSelectedDistrictNav("");
    setSelectedNameNav("");
    setSelectedStateNav("");
    setSelectedTalukaNav("");

    setErrors({});
  };

  const [errors, setErrors] = useState({
    clg_source_id: "",
    clg_states_id: "",
    clg_district_id: "",
    clg_tehsil_id: "",
    clg_source_name_id: "",
    grp_id: "",
    clg_ref_id: "",
    clg_gender: "",
    clg_Date_of_birth: "",
    clg_mobile_no: "",
    clg_email: "",
    clg_address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Dropdown / Select handlers
    if (name === "clg_source") setSelectedSourcee(value);
    if (name === "clg_state") setSelectedState(value);
    if (name === "clg_district") setSelectedDistrict(value);
    if (name === "clg_tahsil") setSelectedTaluka(value);
    if (name === "clg_source_name_id") setSelectedName(value);
    if (name === "grp_id") setSelectedRole(value);

    // -----------------------------
    // VALIDATION LOGIC
    // -----------------------------
    let errorMessage = "";

    // 1️⃣ MOBILE NUMBER VALIDATION
    if (name === "clg_mobile_no") {
      const indianMobilePattern = /^[6-9]\d{9}$/;

      if (!value) {
        errorMessage = "Mobile Number is required";
      } else if (!indianMobilePattern.test(value)) {
        errorMessage = "Invalid Mobile Number";
      } else {
        errorMessage = "";
      }
    }

    // 2️⃣ NAME VALIDATION (Max 3 words)
    if (name === "clg_ref_id") {
      if (!value.trim()) {
        errorMessage = "Name is required";
      } else {
        const words = value.trim().split(" ");
        if (words.length > 3) {
          errorMessage = "Name cannot contain more than three words";
        }
      }
    }

    // 3️⃣ EMAIL VALIDATION
    if (name === "clg_email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!value) {
        errorMessage = "Email is required";
      } else if (!emailPattern.test(value)) {
        errorMessage = "Invalid Email Address";
      }
    }

    // 4️⃣ DATE OF BIRTH VALIDATION (18+ Check)
    if (name === "clg_Date_of_birth") {
      const dob = new Date(value);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      if (dob > eighteenYearsAgo) {
        errorMessage = "Must be 18 years or older";
      }
    }

    // Apply error state finally
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};

    // Select dropdown validations
    if (!selectedSourcee) tempErrors.clg_source = "Source is required";
    if (!selectedState) tempErrors.clg_state = "State is required";
    if (!selectedDistrict) tempErrors.clg_district = "District is required";
    if (!selectedTaluka) tempErrors.clg_tahsil = "Tehsil is required";
    if (!formData.clg_source_name)
      tempErrors.clg_source_name = "Workshop is required";
    if (!selectedRole) tempErrors.Group_id = "Role is required";

    // TextField validations
    if (!formData.clg_ref_id?.trim())
      tempErrors.clg_ref_id = "Name is required";
    if (!formData.clg_gender) tempErrors.clg_gender = "Gender is required";
    if (!formData.clg_Date_of_birth)
      tempErrors.clg_Date_of_birth = "DOB is required";

    if (!formData.clg_mobile_no) {
      tempErrors.clg_mobile_no = "Mobile Number is required";
    } else if (formData.clg_mobile_no.length !== 10) {
      tempErrors.clg_mobile_no = "Mobile must be 10 digits";
    }

    if (!formData.clg_email) {
      tempErrors.clg_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.clg_email)) {
      tempErrors.clg_email = "Invalid email format";
    }

    if (!formData.clg_address?.trim())
      tempErrors.clg_address = "Address is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0; // true = valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ Form invalid → Mandatory Modal + Snackbar
    if (!validateForm()) {
      setMandotoryModel(true);
      showSnackbar("Please fix the errors!", "error");
      return;
    }

    const userData = {
      ...formData,
      password: "1234",
      password2: "1234",
      clg_added_by: userID,
    };

    if (updateSrc) {
      userData.clg_modify_by = userID;
    }

    try {
      let url = "";
      let method = "";

      if (!updateSrc) {
        url = `${API_URL}/Screening/register/`;
        method = "POST";
      } else {
        url = `${API_URL}/Screening/User_PUT/${formData.pk}/`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      // -----------------------------------------------
      // ✅ CREATE SUCCESS
      // -----------------------------------------------
      if (!updateSrc && response.status === 201) {
        const data = await response.json();

        setShowModal(true); // OPEN REGISTER MODAL
        showSnackbar("User Registered Successfully!", "success");

        setTableData((prev) => [...prev, data]);
        resetForm();
        return;
      }

      // -----------------------------------------------
      // ✅ UPDATE SUCCESS
      // -----------------------------------------------
      if (updateSrc && response.ok) {
        const updatedUser = await response.json();

        setUpdateModel(true); // OPEN UPDATE MODAL
        showSnackbar("User Updated Successfully!", "success");

        setTableData((prev) => {
          const i = prev.findIndex((x) => x.pk === updatedUser.pk);
          if (i !== -1) {
            const updated = [...prev];
            updated[i] = updatedUser;
            return updated;
          }
          return prev;
        });

        resetForm();
        return;
      }

      // -----------------------------------------------
      // ❌ MISSING FIELDS ERROR (400)
      // -----------------------------------------------
      if (response.status === 400) {
        setMandotoryModel(true); // OPEN MANDATORY MODAL
        showSnackbar("Please fill all required (*) fields!", "warning");
        return;
      }

      // -----------------------------------------------
      // ❌ USER EXIST ERROR (409)
      // -----------------------------------------------
      if (response.status === 409) {
        setExistModel(true); // OPEN EXIST MODAL
        showSnackbar("User already exists!", "error");
        return;
      }

      // -----------------------------------------------
      //
      // -----------------------------------------------
      showSnackbar("Something went wrong. Please try again.", "error");
    } catch (err) {
      console.error("Error:", err);
      showSnackbar("Network error! Check connection.", "error");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const isValid = validateForm();

  //   if (formData.clg_mobile_no.length < 10) {
  //     console.log('Contact number must be at least 10 characters long.');
  //     alert("Contact number must be at least 10 digit long.");
  //     return;
  //   }

  //   if (isValid) {
  //     const userData = {
  //       ...formData,
  //       password: "1234",
  //       password2: "1234",
  //       clg_source: formData.clg_source,
  //       clg_state: formData.clg_state,
  //       clg_district: formData.clg_district,
  //       clg_tahsil: formData.clg_tahsil,
  //       clg_source_name: formData.clg_source_name,
  //       clg_added_by: userID,
  //     };

  //     if (updateSrc) {
  //       userData.clg_modify_by = userID;  // Add clg_modify_by for PUT request
  //     }

  //     try {
  //       if (!updateSrc) {
  //         const response = await fetch(`${API_URL}/Screening/register/`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(userData),
  //         });

  //         // Handle POST response

  //       }
  //       else {
  //         const response = await fetch(`${API_URL}/Screening/User_PUT/${formData.pk}/`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(userData),
  //         });

  //         console.log('hhhhhhhhhhhhhhhh', userData);

  //         if (response.status === 200) {
  //           console.log('Updated successfully:', response);
  //           setUpdateModel(true);
  //         } else {
  //           console.error('Error updating user. Unexpected response:', response);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   } else {
  //     console.log('Form has errors, please correct them.');
  //   }
  // };

  ////// table row click

  const handleTableRowClick = async (pk) => {
    try {
      const response = await fetch(`${API_URL}/Screening/User_GET_ID/${pk}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      console.log("Fetched Data:", data);
      console.log(data.source_id, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

      setFormData((prev) => ({
        ...prev,
        clg_ref_id: data.clg_ref_id,
        clg_gender: data.gender_id,
        clg_Date_of_birth: data.clg_Date_of_birth,
        clg_mobile_no: data.clg_mobile_no,
        clg_email: data.clg_email,
        clg_address: data.clg_address,

        pk: data.pk,

        clg_source_id: data.source_id,
        clg_states_id: data.state_id,
        clg_district_id: data.district_id,
        clg_tehsil_id: data.tehsil_id,
        clg_source_name_id: data.source_name_id,
        grp_id: data.group_id, // <-- FIXED
        clg_genderr_id: data.gender_id,
      }));
      setSelectedSourcee(data.source_id);
      setSelectedState(data.state_id);
      setSelectedDistrict(data.district_id);
      setSelectedTaluka(data.tehsil_id);
      setSelectedName(data.source_name_id);
      setSelectedRole(data.group_id);
    } catch (error) {
      console.error("Error fetching detailed information:", error);
    }

    setSelectedRowIndex(pk);
  };

  const handleSearch = async () => {
    let apiUrl = `${API_URL}/Screening/filter-User/?`;

    if (selectedSourceeNav) {
      apiUrl += `clg_source=${selectedSourceeNav}&`;
    }

    if (selectedStateNav) {
      apiUrl += `clg_state=${selectedStateNav}&`;
    }

    if (selectedDistrictNav) {
      apiUrl += `clg_district=${selectedDistrictNav}&`;
    }

    if (selectedTalukaNav) {
      apiUrl += `clg_tahsil=${selectedTalukaNav}&`;
    }

    if (selectedName) {
      apiUrl += `clg_source_name=${selectedName}&`;
    }

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTableData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  ////////////// Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const deleteUrl = `${API_URL}/Screening/User_DELETE/${formData.pk}/${userID}/`;

      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTableData((prev) => prev.filter((item) => item.pk !== formData.pk));

      // RESET FORM COMPLETELY
      resetForm();

      // OPEN DELETE SUCCESS MODAL
      setDeleteModel(true);

      // SNACKBAR SUCCESS
      showSnackbar("User Deleted Successfully!", "success");
    } catch (error) {
      console.error("Error deleting data:", error);

      showSnackbar("User Failed to Delete!", "error");
    }
  };

  const handleClicked = () => {
    setFormEnabled(true);
    setUpdateSrc(false); // Set to false to indicate updating an existing user
  };

  const handleClickCombined = () => {
    toggleForm();
    handleClicked();
  };

  // console.log('userData in table', formData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    const q = searchQuery.toLowerCase();
    return tableData.filter((row) =>
      Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(q)
      )
    );
  }, [tableData, searchQuery]);

  const startIndex = page * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const [formAction, setFormAction] = useState("");

  return (
    <Box sx={{ p: 2, m: "0em 0em 0 3.5em" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Card
        sx={{
          borderRadius: 3,
          bgcolor: "#ffffff",
        }}
      >
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: "#1439A4", fontFamily: "Roboto" }}
              >
                User List
              </Typography>
            </Grid>

            {canAddUser && (
              <Grid item>
                <Link to="" style={{ textDecoration: "none" }}>
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#1976d2",
                      color: "white",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                    onClick={() => {
                      handleClickCombined();
                      resetForm();
                      setFormAction("add");
                    }}
                  >
                    <PersonAddAltIcon />
                  </IconButton>
                </Link>
              </Grid>
            )}
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                sx={{
                  minWidth: 120,
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                select
                fullWidth
                size="small"
                label="Source"
                value={selectedSourceeNav}
                onChange={(e) => setSelectedSourceeNav(e.target.value)}
              >
                <MenuItem value="">Select Source</MenuItem>
                {sourceOptionNav.map((drop) => (
                  <MenuItem key={drop.clg_source} value={drop.source_pk_id}>
                    {drop.source}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                sx={{
                  minWidth: 120,
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                select
                fullWidth
                size="small"
                label="Source State"
                value={selectedStateNav}
                onChange={(e) => setSelectedStateNav(e.target.value)}
              >
                <MenuItem value="">Select State</MenuItem>

                {stateOptionsNav.map((drop) => (
                  <MenuItem key={drop.state_id} value={drop.state_id}>
                    {drop.state_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                sx={{
                  minWidth: 120,
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                select
                fullWidth
                size="small"
                label="Source District"
                value={selectedDistrictNav}
                onChange={(e) => setSelectedDistrictNav(e.target.value)}
              >
                <MenuItem value="">Select District</MenuItem>

                {districtOptionsNav.map((drop) => (
                  <MenuItem key={drop.dist_id} value={drop.dist_id}>
                    {drop.dist_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                sx={{
                  minWidth: 120,
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                select
                fullWidth
                size="small"
                label="Select Tehsil"
                value={selectedTalukaNav || ""} // safety fallback
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTalukaNav(value === "" ? "" : Number(value));
                }}
              >
                <MenuItem value="">Select Tehsil</MenuItem>

                {talukaOptionsNav.length > 0 ? (
                  talukaOptionsNav.map((drop) => (
                    <MenuItem key={drop.tal_id} value={drop.tal_id}>
                      {drop.tahsil_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No data available</MenuItem>
                )}
              </TextField>
            </Grid>

           <Grid item xs={12} sm={6} md={2}>
  <TextField
    sx={{
      minWidth: 120,
      "& .MuiInputBase-input.MuiSelect-select": {
        color: "#000 !important",
      },
      "& .MuiSvgIcon-root": {
        color: "#000",
      },
    }}
    select
    fullWidth
    size="small"
    label="Workshop Name"
    value={selectedNameNav}
    onChange={(e) => setSelectedNameNav(e.target.value)}
  >
    <MenuItem value="">Select workshop Name</MenuItem>

    {sourceNameOptionsNav.map((drop) => (
      <MenuItem key={drop.ws_pk_id} value={drop.ws_pk_id}>
        {drop.Workshop_name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

            <Grid item xs={6} sm={3} md={1}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ p: 1 }}>
        <Grid container spacing={1}>
          {showForm && (
            <Grid
              item
              xs={12}
              md={6}
              className={transitioning ? "sliding-out" : ""}
            >
              <Card elevation={4}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Register New User
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                      }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setUpdateSrc(true);
                          setFormEnabled(true);
                          setFormAction("update");
                        }}
                      >
                        <DriveFileRenameOutlineOutlined />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteSrc(false);
                          handleDelete();
                        }}
                      >
                        <DeleteOutlineOutlined />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Source</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="clg_source"
                            value={selectedSourcee}
                            onChange={handleChange}
                            label="Source"
                          >
                            <MenuItem value="">
                              {formData.source_id || "Select Source"}
                            </MenuItem>
                            {sourceOption.map((source) => (
                              <MenuItem
                                key={source.source_pk_id}
                                value={source.source_pk_id}
                              >
                                {source.source}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.clg_source && (
                            <Typography
                              sx={{ color: "red", fontSize: "12px", mt: 0.5 }}
                            >
                              {errors.clg_source}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* State */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.clg_state}>
                          <InputLabel>Source State</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="clg_state"
                            value={selectedState}
                            onChange={handleChange}
                            label="Source State"
                          >
                            <MenuItem value="">
                              {formData.state_name || "Select State"}
                            </MenuItem>
                            {stateOptions.map((state) => (
                              <MenuItem
                                key={state.state_id}
                                value={state.state_id}
                              >
                                {state.state_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.clg_state && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.clg_state}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* District */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.clg_district}>
                          <InputLabel>Source District</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="clg_district"
                            value={selectedDistrict}
                            onChange={handleChange}
                            label="Source District"
                          >
                            <MenuItem value="">
                              {formData.clg_district_id || "Select District"}
                            </MenuItem>
                            {districtOptions.map((district) => (
                              <MenuItem
                                key={district.dist_id}
                                value={district.dist_id}
                              >
                                {district.dist_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.clg_district && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.clg_district}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Tehsil */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.clg_tahsil}>
                          <InputLabel>Source Tehsil</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="clg_tahsil"
                            value={selectedTaluka}
                            onChange={handleChange}
                            label="Source Tehsil"
                          >
                            <MenuItem value="">
                              {formData.tal_id || "Select Tehsil"}
                            </MenuItem>
                            {talukaOptions.map((taluka) => (
                              <MenuItem
                                key={taluka.tal_id}
                                value={taluka.tal_id}
                              >
                                {taluka.tahsil_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.clg_tahsil && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.clg_tahsil}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* workshop Name */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.clg_source_name}>
                          <InputLabel>Workshop Name</InputLabel>
                          <Select
                            size="small"
                            name="clg_source_name"
                            value={formData.clg_source_name || ""}
                            onChange={handleChange}
                            label="Workshop Name"
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                          >
                            <MenuItem value="">
                              {formData.clg_source_name || "Workshop Name"}
                            </MenuItem>

                            {sourceNameOptions.map((Workshop) => (
                              <MenuItem
                                key={Workshop.ws_pk_id}
                                value={Workshop.ws_pk_id}
                              >
                                {Workshop.Workshop_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.clg_source_name && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.clg_source_name}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Role */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.Group_id}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="grp_id"
                            value={selectedRole}
                            onChange={handleChange}
                            label="Role"
                            required
                          >
                            <MenuItem value="">
                              {formData.Group_id || "Select Role"}
                            </MenuItem>
                            {roleForm.map((source) => (
                              <MenuItem
                                key={source.Group_id}
                                value={source.Group_id}
                              >
                                {source.grp_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.Group_id && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.Group_id}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Name */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                          size="small"
                          label="Name"
                          name="clg_ref_id"
                          value={formData.clg_ref_id}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors.clg_ref_id}
                          helperText={errors.clg_ref_id}
                        />
                      </Grid>

                      {/* Gender */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            sx={{
                              minWidth: 120,
                              "& .MuiInputBase-input.MuiSelect-select": {
                                color: "#000 !important",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#000",
                              },
                            }}
                            size="small"
                            name="clg_gender"
                            value={formData.clg_gender}
                            onChange={handleChange}
                            label="Gender"
                          >
                            <MenuItem value="">
                              {formData.clg_genderr_id || "Select Gender"}
                            </MenuItem>
                            {gender.map((g) => (
                              <MenuItem
                                key={g.gender_pk_id}
                                value={g.gender_pk_id}
                              >
                                {g.gender}
                              </MenuItem>
                            ))}
                          </Select>

                          {errors.clg_gender && (
                            <Typography sx={{ color: "red", fontSize: 12 }}>
                              {errors.clg_gender}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      {/* DOB */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                          size="small"
                          label="DOB"
                          name="clg_Date_of_birth"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={formData.clg_Date_of_birth}
                          onChange={handleChange}
                          fullWidth
                          error={Boolean(errors.clg_Date_of_birth)}
                          helperText={errors.clg_Date_of_birth}
                          required
                        />
                      </Grid>

                      {/* Mobile */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                          size="small"
                          label="Mobile Number"
                          name="clg_mobile_no"
                          value={formData.clg_mobile_no}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!errors.clg_mobile_no}
                          helperText={errors.clg_mobile_no}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                          size="small"
                          label="Email ID"
                          name="clg_email"
                          value={formData.clg_email}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors.clg_email}
                          helperText={errors.clg_email}
                        />
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                          size="small"
                          label="Address"
                          name="clg_address"
                          value={formData.clg_address}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors.clg_address}
                          helperText={errors.clg_address}
                        />
                      </Grid>

                      {/* Submit Button */}
                      <Grid item xs={12}>
                        {formAction === "add" && (
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            Submit
                          </Button>
                        )}
                        {formAction === "update" && (
                          <Button
                            variant="contained"
                            color="success"
                            type="submit"
                          >
                            Update
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} md={showForm ? 6 : 12}>
            <Card elevation={4}>
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  alignItems="end"
                  justifyContent="end"
                  sx={{ mb: 1 }}
                >
                  <Grid container alignItems="center" sx={{ mt: 1 }}>
                    {/* Empty space that pushes search field to the right */}
                    <Grid item xs />

                    {/* Search field at the end */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        sx={{
                          minWidth: 120,
                          "& .MuiInputBase-input.MuiSelect-select": {
                            color: "#000 !important",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#000",
                          },
                        }}
                        size="small"
                        label="Search User"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setPage(0); // 🔥 new search → always go to first page (0)
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {/* TABLE HEADER */}
                    <Table
                      sx={{
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        borderRadius: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#4a7cf3ff" }}>
                          {["Sr No", "User Name", "Mobile No", "Email ID"].map(
                            (header, i) => (
                              <TableCell
                                key={i}
                                sx={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  fontSize: "12px",
                                }}
                                width={
                                  i === 0
                                    ? "15%"
                                    : i === 1
                                    ? "30%"
                                    : i === 2
                                    ? "25%"
                                    : "35%"
                                }
                              >
                                {header}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      </TableHead>
                    </Table>

                    <Box mt={1}>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                          const serialNumber = startIndex + index + 1;
                          const isSelected = selectedRowIndex === item.pk;

                          return (
                            <Card
                              key={item.pk ?? index}
                              elevation={isSelected ? 6 : 2}
                              sx={{
                                mb: 1,
                                cursor: "pointer",
                                bgcolor: isSelected ? "#E3F2FD" : "#fff",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": { boxShadow: 6 },
                                borderRadius: "20px",
                                fontSize: "12px",
                              }}
                              onClick={() => {
                                handleTableRowClick(item.pk);
                                setFormAction("view");
                              }}
                            >
                              <CardContent sx={{ p: 1 }}>
                                <Grid
                                  container
                                  alignItems="center"
                                  justifyContent="space-between"
                                  textAlign="center"
                                >
                                  <Grid item sx={{ width: "10%" }}>
                                    <Typography sx={{ fontSize: "12px" }}>
                                      {serialNumber}
                                    </Typography>
                                  </Grid>

                                  <Grid item sx={{ width: "30%" }}>
                                    <Typography sx={{ fontSize: "12px" }}>
                                      {item.clg_ref_id}
                                    </Typography>
                                  </Grid>

                                  <Grid item sx={{ width: "25%" }}>
                                    <Typography sx={{ fontSize: "12px" }}>
                                      {item.clg_mobile_no}
                                    </Typography>
                                  </Grid>

                                  <Grid item sx={{ width: "35%" }}>
                                    <Typography sx={{ fontSize: "12px" }}>
                                      {item.clg_email}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <Typography align="center" sx={{ mt: 2 }}>
                          No data found
                        </Typography>
                      )}
                    </Box>

                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 20]}
                      />
                    </Box>

                    {/* PAGINATION */}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Dialogs */}
        <Dialog open={showModal} onClose={handleRegisterModel}>
          <DialogTitle>User Registered Successfully</DialogTitle>
          <DialogActions>
            <Button onClick={handleRegisterModel}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteModel} onClose={handleDeleteModel}>
          <DialogTitle>User Deleted Successfully</DialogTitle>
          <DialogActions>
            <Button onClick={handleDeleteModel}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={mandotoryModel} onClose={handleMandotoryModel}>
          <DialogTitle>Fill the Mandatory Fields</DialogTitle>
          <DialogActions>
            <Button onClick={handleMandotoryModel} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={updateModel} onClose={handleUpdateModel}>
          <DialogTitle>User Details Updated Successfully</DialogTitle>
          <DialogActions>
            <Button onClick={handleUpdateModel}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={existModel} onClose={handleExistModel}>
          <DialogTitle>User Already Exists</DialogTitle>
          <DialogActions>
            <Button onClick={handleExistModel} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddUser;
