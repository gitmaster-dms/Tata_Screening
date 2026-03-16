import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AddSource.css";
import {
  Box,
  Grid,
  Button,
  TextField,
  IconButton,
  TablePagination,
  CircularProgress,
  Typography,
  MenuItem,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText,
  Fade,
  Backdrop,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Checkbox } from "@mui/material";
import {
  DriveFileRenameOutlineOutlined,
  DeleteOutlineOutlined,
  Add,
} from "@mui/icons-material";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Snackbar, Alert } from "@mui/material";
import { InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from '@mui/icons-material/Lock';
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const libraries = ["places"];
const iconBlue = {
  background: "rgba(10, 112, 183, 1)",
  cursor: "pointer",
  borderRadius: "6px",
  color: "#fff",
  p: "2px",
  mr: 1,
  "&:hover": {
    opacity: 0.8,
  },
};
const AddSource = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const userID = localStorage.getItem("userID");
  console.log(userID);
  const SourceUrlId = localStorage.getItem("loginSource");

  //permission code start
  // permission code start

  const [canAddSource, setCanAddSource] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");

    const parsedPermissions = storedPermissions
      ? JSON.parse(storedPermissions)
      : [];

    console.log("Parsed Permissions:", parsedPermissions);

    // reusable permission checker
    const getPermission = (module, action) => {
      return parsedPermissions.some((p) =>
        p.modules_submodule?.some(
          (m) =>
            m.moduleName === module &&
            m.selectedSubmodules?.some((s) => s.submoduleName === action)
        )
      );
    };

    // set permissions
    setCanAddSource(getPermission("Workshop", "Add"));
    setCanEdit(getPermission("Workshop", "Edit"));
    setCanDelete(getPermission("Workshop", "Delete"));
  }, []);

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false); /////// model
  const [showModalExist, setShowModalExist] = useState(false); /////// model
  const [tableinfo, setTableInfo] = useState([]); /// data in table variable
  console.log(tableinfo, "tableinfor");
  const [workshopList, setWorkshopList] = useState([]);
  console.log("workshopListaaaaaaa", workshopList);

  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  ////////////////////// Form Dropdown /////////////////
  const [dropdownSource, setDropdownSource] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [talukaOptions, setTalukaOptions] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTahsil, setSelectedTahsil] = useState("");
  ////////////////////////////////////////////////////////////
  const [isFormEnabled, setFormEnabled] = useState(false); //Form Disable
  //////////////////////////// Nav Dropdown //////////////////////////
  const [sourceNav, setSourceNav] = useState([]); // State for source options
  const [updateSrc, setUpdateSrc] = useState(true);
  const [deleteSrc, setDeleteSrc] = useState(true);

  const [updateModel, setUpdateModel] = useState(false); /////// model
  const [deleteModel, setDeleteModel] = useState(false); /////// model
  const [showModalMissing, setShowModalMissing] = useState(false); /////// model

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(" LOADING STATE CHANGED:", loading);
  }, [loading]);
  const [tableLoading, setTableLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  //_____________________________________VITALS API OF DROPDOWN_______________________________
  const [screeningVitals, setScreeningVitals] = useState([]);
  const [subScreening, setSubScreening] = useState([]);
  const [selectedVitals, setSelectedVitals] = useState([]);
  console.log(selectedVitals, "vitals name fetching......");

  const [selectedSubVitals, setSelectedSubVitals] = useState([]);
  const [selectedVitalId, setSelectedVitalId] = useState(null);
  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterTaluka, setFilterTaluka] = useState("");

  //// GIS Address
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [gisAddress, setGisAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  console.log(gisAddress, lat, long, "GIS Address details");

  const addressRef = useRef();

  const handlePlaceChanged = () => {
    console.log("place select function hitting...");
    if (addressRef.current) {
      const place = addressRef.current.getPlace();
      console.log("place object", place);

      if (!place.geometry || !place.geometry.location) {
        console.warn("No geometry found for the selected place");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const formattedLat = parseFloat(lat.toFixed(6));
      const formattedLng = parseFloat(lng.toFixed(6));

      // Set the full formatted address
      setGisAddress(place.formatted_address);
      setLat(formattedLat);
      setLong(formattedLng);

      console.log("Selected Address:", place.formatted_address);
      console.log("Latitude:", formattedLat);
      console.log("Longitude:", formattedLng);
    }
  };

  // Fetching screening vitals
  useEffect(() => {
    const fetchScreeningVitals = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/GET_Screening_List/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = response.data;
        setScreeningVitals(data);
      } catch (error) {
        console.error("Error fetching screening vitals:", error);
      }
    };

    fetchScreeningVitals();
  }, []);

  // Handling the change in selected vitals
  useEffect(() => {
    if (selectedVitals.includes(5)) {
      const selectedVital = screeningVitals.find(
        (vital) => vital.sc_list_pk_id === 5,
      );
      if (selectedVital) {
        setSelectedVitalId(selectedVital.sc_list_pk_id);
      } else {
        setSelectedVitalId(null);
      }
    } else {
      setSelectedVitalId(null);
    }
  }, [selectedVitals, screeningVitals]);

  useEffect(() => {
    const fetchSubVitals = async () => {
      if (selectedVitalId === 5) {
        try {
          const response = await axios.get(
            `${Port}/Screening/Screening_sub_list/?screening_list=${selectedVitalId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const data = response.data;
          console.log("Fetching Sub Vitals....", data);
          setSubScreening(data);
        } catch (error) {
          console.error("Error fetching screening sub-vitals:", error);
        }
      } else {
        setSubScreening([]); // Clear subScreening if selectedVitalId is not 5
      }
    };

    fetchSubVitals();
  }, [selectedVitalId]);
  //_____________________________________VITALS API OF DROPDOWN END_______________________________

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = Array.isArray(tableinfo)
    ? tableinfo.filter((data) =>
      Object.values(data)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    : [];
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const [errors, setErrors] = useState({
    source: "",
    Workshop_name: "",
    registration_no: "",
    mobile_no: "",
    email_id: "",
    ws_pincode: "",
    ws_address: "",
    ws_state: "",
    ws_district: "",
    ws_taluka: "",
    screening_vitals: "",
    password: "",
    confirm_password: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!selectData.source) {
      newErrors.source = "Source is required";
    }

    if (!selectData.Workshop_name) {
      newErrors.Workshop_name = "Workshop Name is required";
    }

    if (!selectData.registration_no) {
      newErrors.registration_no = "Registration Number is required";
    }

    if (!selectData.mobile_no) {
      newErrors.mobile_no = "Mobile Number is required";
    } else if (!/^\d{10,13}$/.test(selectData.mobile_no)) {
      newErrors.mobile_no = "Invalid Contact Number";
    }

    if (!selectData.email_id) {
      newErrors.email_id = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectData.email_id)) {
      newErrors.email_id = "Invalid email address format";
    }

    // if (!selectData.Registration_details) {
    //     newErrors.Registration_details = 'Registration Details are required';
    // }

    if (!selectData.ws_pincode) {
      newErrors.ws_pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(selectData.ws_pincode)) {
      newErrors.ws_pincode = "Invalid Pincode";
    }

    if (!selectData.password) {
      newErrors.password = "Password is required";
    }

    if (!selectData.confirm_password) {
      newErrors.confirm_password = "Confirm Password is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailBlur = (e) => {
    const value = e.target.value.trim();

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        email_id: "Email is required",
      }));
      return;
    }

    if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email_id: "Enter a valid email address",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      email_id: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strong Password Regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Password Validation
    if (name === "password") {
      let error = "";

      if (!passwordRegex.test(value)) {
        error =
          "Password must be 8+ chars with Uppercase, Lowercase, Number & Special Character";
      }

      setErrors((prev) => ({
        ...prev,
        password: error,
      }));
    }

    // Confirm Password Validation
    if (name === "confirm_password") {
      let error = "";

      if (value !== selectData.password) {
        error = "Passwords do not match";
      }

      setErrors((prev) => ({
        ...prev,
        confirm_password: error,
      }));
    }

    if (name === "sub_screening_vitals") {
      const normalized = Array.isArray(value)
        ? value.map(Number)
        : [Number(value)];

      setSelectedSubVitals(normalized);
      setSelectData((prev) => ({
        ...prev,
        sub_screening_vitals: normalized,
      }));
      return;
    }

    if (name === "screening_vitals") {
      const normalized = Array.isArray(value)
        ? value.map(Number)
        : [Number(value)];

      setSelectedVitals(normalized);
      setSelectData((prev) => ({
        ...prev,
        screening_vitals: normalized,
      }));
      return;
    }

    setSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setSelectData({
      source: "6",
      Workshop_name: "",
      registration_no: "",
      mobile_no: "",
      email_id: "",
      Registration_details: "",
      ws_pincode: "",
      ws_address: "",
      ws_state: "",
      ws_district: "",
      ws_taluka: "",
    });

    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTahsil("");

    // Reset multi-selects
    setSelectedVitals([]);
    setSelectedSubVitals([]);

    // Reset GIS
    setGisAddress("");
    setLat(null);
    setLong(null);

    // Reset errors
    setErrors({});
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [distList, setDistList] = useState([]);

  //////// POST API for source /////////////
  const [selectData, setSelectData] = useState({
    pk_id: "",
    source: "6",
    Workshop_name: "",
    registration_no: "",
    mobile_no: "",
    email_id: "",
    ws_pincode: "",
    ws_address: "",
    pk_id: "",
    added_by: userID,
    add_source_id: "",
    add_state_id: "",
    add_district_id: "",
    add_tehsil_id: "",
    source_state: "",
    source_district: "",
    source_taluka: "",
    Registration_details: null,
    password: "",
    confirm_password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      if (selectData.mobile_no.length < 10) {
        setSnackbarMessage("Contact number must be at least 10 digits long.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const formData = new FormData();
      formData.append("source", selectData.source || "");
      formData.append("Workshop_name", selectData.Workshop_name || "");
      formData.append("registration_no", selectData.registration_no || "");
      formData.append("mobile_no", selectData.mobile_no || "");
      formData.append("email_id", selectData.email_id || "");
      formData.append("ws_pincode", selectData.ws_pincode || "");
      formData.append("ws_address", gisAddress || "");
      formData.append("pk_id", selectData.pk_id || "");

      if (selectedState) formData.append("ws_state", selectedState);
      if (selectedDistrict) formData.append("ws_district", selectedDistrict);
      if (selectedTahsil) formData.append("ws_taluka", selectedTahsil);

      formData.append(
        "screening_vitals",
        JSON.stringify(selectedVitals) || "[]",
      );
      formData.append(
        "sub_screening_vitals",
        JSON.stringify(selectedSubVitals) || "[]",
      );

      const userID = localStorage.getItem("userID");

      if (updateSrc) {
        try {
          formData.append("added_by", userID);

          const response = await fetch(`${Port}/Screening/Workshop_Post/`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (response.status === 201) {
            const data = await response.json();
            setShowModal(true);
            setTableInfo([...tableinfo, data]);
            setSnackbarMessage("Data sent successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            resetForm();
            setSelectData({
              source: "",
              Workshop_name: "",
              registration_no: "",
              mobile_no: "",
              email_id: "",
              Registration_details: "",
              ws_pincode: "",
              ws_address: "",
              ws_state: "",
              ws_district: "",
              ws_taluka: "",
            });
          } else if (response.status === 400) {
            setShowModalMissing(true);
            setSnackbarMessage("Missing required fields.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
          } else if (response.status === 409) {
            setShowModalExist(true);
            setSnackbarMessage("This record already exists!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          } else {
            setSnackbarMessage("Unexpected response from server.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (error) {
          setSnackbarMessage("Error sending data!");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } else {
        // if (!updateSrc) {
        try {
          formData.append("modify_by", userID);

          const response = await fetch(
            `${Port}/Screening/Workshop_Update/${selectedRow}/`,
            {
              method: "PUT",
              body: formData,
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          if (response.status === 200) {
            const result = await response.json();
            const data = result.data; // 👈 Important

            setTableInfo((prev) =>
              prev.map((row) =>
                row.ws_pk_id === selectedRow ? { ...row, ...data } : row,
              ),
            );
            // Populate form fields with updated data
            setSelectData({
              ws_pk_id: data.ws_pk_id,
              Workshop_name: data.Workshop_name,
              registration_no: data.registration_no,
              mobile_no: data.mobile_no,
              email_id: data.email_id,
              ws_pincode: data.ws_pincode,
              ws_address: data.ws_address,
              source: data.source,
            });

            setSelectedState(Number(data.ws_state));
            setSelectedDistrict(Number(data.ws_district));
            setSelectedTahsil(Number(data.ws_taluka));

            setSelectedVitals(data.screening_vitals || []);
            setSelectedSubVitals(data.sub_screening_vitals || []);
            setSelectedRow(null);
            setSelectedSourceId(null);
            // Success message

            setSnackbarMessage("Workshop updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // ✅ Do NOT resetForm() here
          } else {
            setSnackbarMessage(
              `Error updating source. Status: ${response.status}`,
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error("Update error:", error);
          setSnackbarMessage("Error updating workshop!");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    }
    // }
    else {
      setSnackbarMessage("Please fill in all required fields. ");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  ///////// get API for Table //////////////
  useEffect(() => {
    if (!filterTaluka) return; // ✅ RIGHT
    setDropdownLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/Workshop_list_get/${filterTaluka}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();
        setWorkshopList(data);
      } catch (error) {
        console.log("Error fetching source data", error);
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchData();
  }, [filterTaluka]);

  //////////////////// Delete
  const handleDelete = async () => {
    console.log("Received sourceId:", selectData.pk_id);

    const userID = localStorage.getItem("userID");
    console.log(userID);

    try {
      await axios.delete(`${Port}/Screening/Workshop_delete/${selectedRow}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Data Deleted successfully");

      console.log("Before delete:", tableinfo);

      setTableInfo((prevTableInfo) =>
        prevTableInfo.filter(
          (item) => item.source_pk_id !== selectData.source_pk_id,
        ),
      );

      console.log("After delete:", tableinfo);

      setOpenDeleteDialog(false);
      setDeleteModel(true);
      resetForm();
      setSnackbarMessage("Deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting data:", error);
      setSnackbarMessage("Failed to delete data!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  ////////////// Source Dropdown //////////////
  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/source_GET/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const options = response.data;
        setDropdownSource(options);
      } catch (error) {
        console.log("Error While Fetching Data", error);
      }
    };
    fetchSource();
  }, []);

  ////////////////////////////// navbar value dropdown get ///////////////////////////////
  useEffect(() => {
    fetch(`${Port}/Screening/Source_Get/?source_pk_id=${SourceUrlId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSourceNav(data);
      })
      .catch((error) => {
        console.error("Error fetching sources:", error);
      });
  }, []);

  const [stateList, setStateList] = useState([]);
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${Port}/Screening/State_Get/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setStateOptions(data);
        setStateList(data);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    console.log("Selected State changed:", selectedState);
    const fetchDistricts = async () => {
      if (!selectedState) return; // wait until a state is selected
      try {
        const res = await fetch(
          `${Port}/Screening/District_Get/${selectedState}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const data = await res.json();
        console.log("Fetched Districts:", data);
        setDistrictOptions(data);
        setDistList(data); // ✅ sets options for nav dropdown
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // Filter District based on selected State
  useEffect(() => {
    const filterDistrict = async () => {
      if (!filterState) return; // wait until a state is selected
      try {
        const res = await fetch(
          `${Port}/Screening/District_Get/${filterState}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const data = await res.json();
        console.log("Fetched Districts:", data);
        setDistrictOptions(data);
        setDistList(data); // ✅ sets options for nav dropdown
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    filterDistrict();
  }, [filterState]);

  //// Soure Tehsil against selected source District/////////
  const [tehList, setTehList] = useState([]);
  useEffect(() => {
    const fetchTehsils = async () => {
      if (!selectedDistrict) return; // wait until a district is selected
      try {
        const res = await fetch(
          `${Port}/Screening/Tehsil_Get/${selectedDistrict}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const data = await res.json();
        setTalukaOptions(data);
        setTehList(data); // ✅ sets options for nav dropdown
      } catch (err) {
        console.error("Error fetching tehsils:", err);
      }
    };
    fetchTehsils();
  }, [selectedDistrict]);

  // Filter Tehsil based on selected District
  useEffect(() => {
    const FilterTaluka = async () => {
      if (!filterDistrict) return; // wait until a district is selected
      try {
        const res = await fetch(
          `${Port}/Screening/Tehsil_Get/${filterDistrict}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const data = await res.json();
        setTalukaOptions(data);
        setTehList(data); // ✅ sets options for nav dropdown
      } catch (err) {
        console.error("Error fetching tehsils:", err);
      }
    };
    FilterTaluka();
  }, [filterDistrict]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setTableLoading(true);

      const params = new URLSearchParams();

      if (selectedWorkshopId) params.append("ws_pk_id", selectedWorkshopId);
      if (filterState) params.append("ws_state", filterState);
      if (filterDistrict) params.append("ws_district", filterDistrict);
      if (filterTaluka) params.append("ws_taluka", filterTaluka);

      const apiUrl = `${Port}/Screening/workshop_filter_api/?${params.toString()}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTableInfo(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error while fetching data", error);
      setTableInfo([]);
    } finally {
      setTableLoading(false);
    }
  };

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const handleTableRowClick = (info) => {
    setSelectedSourceId(info.ws_pk_id);
    setSelectedRow(info.ws_pk_id);
    // Reset form validation errors when selecting a new row
    setErrors({});
    setFormEnabled(false);
  };

  useEffect(() => {
    console.log("id getting here:", selectedSourceId);
  }, [selectedSourceId]);

  const [editData, setEditData] = useState(null);

  const fetchData1 = async () => {
    if (!selectedRow) return;

    try {
      const response = await fetch(
        `${Port}/Screening/Workshop_Update/${selectedRow}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = await response.json();
      setEditData(data); // 🔥 IMPORTANT

      // ✅ BASIC FIELDS
      setSelectData({
        source: data.source || "6",
        Workshop_name: data.Workshop_name || "",
        registration_no: data.registration_no || "",
        mobile_no: data.mobile_no || "",
        email_id: data.email_id || "",
        ws_pincode: data.ws_pincode || "",
        ws_address: data.ws_address || "",
        Registration_details: data.logo || null,
      });

      // ✅ LOCATION (CRITICAL)
      setSelectedState(data.ws_state || "");
      setSelectedDistrict(data.ws_district || "");
      setSelectedTahsil(data.ws_taluka || "");

      // ✅ VITALS
      setSelectedVitals(
        Array.isArray(data.screening_vitals)
          ? data.screening_vitals.map(Number)
          : [],
      );
      setSelectedSubVitals(data.sub_screening_vitals || []);

      // ✅ GIS
      setGisAddress(data.ws_address || "");
      setLat(data.latitude || null);
      setLong(data.longitude || null);

      // ✅ ENABLE FORM FOR EDIT
      setFormEnabled(true);
      setUpdateSrc(false);
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  useEffect(() => {
    if (selectedRow) {
      fetchData1();
    }
  }, [selectedRow]);

  //////////////////////// Password
  const [open, setOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorsNew, setErrorsNew] = useState({});

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 380,
    bgcolor: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    borderRadius: "12px",
    p: 3,
    outline: "none"
  };

  const validatePassword = () => {
    let newErrors = {};

    // minimum 8 chars + must contain @
    const passwordRegex = /^(?=.*[@]).{8,}$/;

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    }
    else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters and contain '@'";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    }
    else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrorsNew(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validatePassword()) {

      console.log("Updated Password:", newPassword);

      setOpen(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setErrorsNew({});
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Card
        sx={{
          p: 1,
          m: "0.1em 1em 0 3.5em",
          borderRadius: "16px",
        }}
      >
        <Box className="row" sx={{ mb: 2 }}>
          <Typography
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: "16px",
              textAlign: "left",
              color: "black",
              px: 2,
            }}
          >
            WorkShop Registration
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Grid item xs={12} sm={8} md={2.5}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label=" State"
                  name="ws_state"
                  variant="outlined"
                  value={filterState}
                  onChange={(event) => setFilterState(event.target.value)}
                  InputLabelProps={{
                    style: { fontWeight: "100", fontSize: "14px" },
                  }}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                >
                  <MenuItem value="">Workshop State</MenuItem>
                  {stateList.map((drop) => (
                    <MenuItem key={drop.state_id} value={drop.state_id}>
                      {drop.state_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label=" District"
                  variant="outlined"
                  name="ws_district"
                  value={filterDistrict}
                  onChange={(event) => setFilterDistrict(event.target.value)}
                  InputLabelProps={{
                    style: { fontWeight: "100", fontSize: "14px" },
                  }}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select District
                  </MenuItem>
                  {distList.map((drop) => (
                    <MenuItem key={drop.dist_id} value={drop.dist_id}>
                      {drop.dist_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label=" Tehsil"
                  variant="outlined"
                  name="ws_tehsil"
                  value={filterTaluka}
                  onChange={(event) => setFilterTaluka(event.target.value)}
                  InputLabelProps={{
                    style: { fontWeight: "100", fontSize: "14px" },
                  }}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Tehsil
                  </MenuItem>
                  {tehList.map((drop) => (
                    <MenuItem key={drop.tal_id} value={drop.tal_id}>
                      {drop.tahsil_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Work Shop Name"
                  name="ws_pk_id"
                  variant="outlined"
                  value={selectedWorkshopId}
                  onChange={(event) =>
                    setSelectedWorkshopId(event.target.value)
                  }
                  InputLabelProps={{
                    style: { fontWeight: "50", fontSize: "14px" },
                  }}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Workshop Name
                  </MenuItem>
                  {workshopList.map((drop) => (
                    <MenuItem key={drop.ws_pk_id} value={drop.ws_pk_id}>
                      {drop.Workshop_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={1.8}
                display="flex"
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSearch}
                  sx={{
                    px: 3,
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                    },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>

      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Card sx={{ p: 2, borderRadius: "16px", ml: "2.5em" }}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography
                  sx={{ fontWeight: 550, fontFamily: "Roboto Sans-serif" }}
                >
                  Add Workshop
                </Typography>

                <Box>
                  <LockIcon
                    sx={{ cursor: "pointer", marginRight: "0.3em" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Lock icon clicked");
                      setOpen(true);
                    }}
                  />

                  {canAddSource && (
                    <Add
                      sx={iconBlue}
                      onClick={() => {
                        setFormEnabled(true);
                        setUpdateSrc(true); // ✅ ADD MODE
                        resetForm();
                      }}
                    />
                  )}

                  {canEdit && selectedRow && (
                    <DriveFileRenameOutlineOutlined
                      sx={{
                        background: "rgba(10, 112, 183, 1)",
                        cursor: "pointer",
                        borderRadius: "6px",
                        color: "#fff",
                        p: "2px",
                        mr: 1,
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 MOST IMPORTANT
                        setFormEnabled(true);
                        setUpdateSrc(false);
                        fetchData1(); // 🔥 explicitly fetch data
                      }}
                    />
                  )}

                  {canDelete && (
                    <DeleteOutlineOutlined
                      sx={{
                        background: "rgba(246, 92, 138, 1)",
                        cursor: "pointer",
                        borderRadius: "6px",
                        color: "#fff",
                        p: "2px",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 card click se bachne ke liye
                        setDeleteSrc(false);
                        setOpenDeleteDialog(true); // ✅ open confirmation dialog
                      }}
                    />
                  )}
                </Box>

                <Dialog
                  open={openDeleteDialog}
                  onClose={() => setOpenDeleteDialog(false)}
                >
                  <DialogTitle>Confirm Delete</DialogTitle>

                  <DialogContent>
                    <Typography>
                      Are you sure you want to delete this record?
                    </Typography>
                  </DialogContent>

                  <DialogActions>
                    <Button
                      onClick={() => setOpenDeleteDialog(false)}
                      color="inherit"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleDelete}
                      color="error"
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>

              <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 400 }}
              >
                <Fade in={open}>
                  <Box sx={style}>

                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                      }}
                    >
                      <Typography fontWeight={600} fontSize={18}>
                        Update Password
                      </Typography>

                      <IconButton size="small" onClick={() => setOpen(false)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    <TextField
                      fullWidth
                      size="small"
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      error={Boolean(errorsNew.newPassword)}
                      helperText={errorsNew.newPassword}
                      sx={{ mb: 2 }}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Confirm Password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmNewPassword}
                      error={Boolean(errorsNew.confirmNewPassword)}
                      helperText={errorsNew.confirmNewPassword}
                      sx={{ mb: 3 }}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirm(!showConfirm)}
                            >
                              {showConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleUpdate}
                      >
                        Update
                      </Button>
                    </Box>

                  </Box>
                </Fade>
              </Modal>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Hidden input to submit static community/source id (6) */}
                  <input
                    type="hidden"
                    name="source"
                    value={selectData.source || "6"}
                  />

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Workshop Name *"
                      name="Workshop_name"
                      value={selectData.Workshop_name}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={!!errors.Workshop_name}
                      helperText={errors.Workshop_name}
                    >
                      {errors.Workshop_name && (
                        <span style={{ color: "red" }}>
                          {errors.Workshop_name || "Workshop Name is required"}
                        </span>
                      )}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Registration Number *"
                      name="registration_no"
                      value={selectData.registration_no}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={!!errors.registration_no}
                      helperText={errors.registration_no}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number *"
                      name="mobile_no"
                      value={selectData.mobile_no}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={
                        !!errors.mobile_no && errors.mobile_no !== "Verified"
                      }
                      helperText={errors.mobile_no}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email ID *"
                      name="email_id"
                      disabled={!isFormEnabled}
                      value={selectData.email_id}
                      onChange={handleChange}
                      onBlur={handleEmailBlur} //  validation
                      size="small"
                      type="email"
                      error={
                        !!errors.email_id && errors.email_id !== "Verified"
                      }
                      helperText={errors.email_id}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                            disabled={!isFormEnabled}
                                        >
                                            Upload Workshop Logo
                                            <input type="file" hidden name="Registration_details" onChange={handleChange} />
                                        </Button>
                                    </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Vitals"
                      name="screening_vitals"
                      disabled={!isFormEnabled}
                      value={selectedVitals}
                      onChange={handleChange}
                      sx={{
                        color: "#000",
                        "& .MuiSelect-select": {
                          color: "#000 !important", // ✅ selected text color
                        },
                        "& .MuiInputBase-root": {
                          color: "#000 !important", // fallback
                        },
                      }}
                      SelectProps={{
                        multiple: true,
                        renderValue: (selected) =>
                          selected.length === 0
                            ? ""
                            : selected
                              .map((val) => {
                                const vital = screeningVitals.find(
                                  (v) =>
                                    Number(v.sc_list_pk_id) === Number(val),
                                );
                                return vital?.screening_list;
                              })
                              .filter(Boolean)
                              .join(", "),
                      }}
                    >
                      {screeningVitals.map((vital) => (
                        <MenuItem
                          key={vital.sc_list_pk_id}
                          value={Number(vital.sc_list_pk_id)}
                        >
                          <Checkbox
                            checked={selectedVitals.includes(
                              Number(vital.sc_list_pk_id),
                            )}
                          />
                          <ListItemText primary={vital.screening_list} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {selectedVitalId === 5 && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Sub Vitals"
                        name="sub_screening_vitals"
                        disabled={!isFormEnabled}
                        value={selectedSubVitals}
                        onChange={handleChange}
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) =>
                            selected.length === 0
                              ? ""
                              : selected
                                .map((val) => {
                                  const subVital = subScreening.find(
                                    (v) =>
                                      Number(v.sc_sub_list_pk_id) ===
                                      Number(val),
                                  );
                                  return subVital?.sub_list;
                                })
                                .filter(Boolean)
                                .join(", "),
                        }}
                        sx={{
                          "& .MuiSelect-select": {
                            color: "#000 !important",
                            whiteSpace: "nowrap", // 🔥 HEIGHT FIX
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      >
                        {subScreening.map((subVital) => (
                          <MenuItem
                            key={subVital.sc_sub_list_pk_id}
                            value={Number(subVital.sc_sub_list_pk_id)}
                          >
                            <Checkbox
                              checked={selectedSubVitals.includes(
                                Number(subVital.sc_sub_list_pk_id),
                              )}
                            />
                            <ListItemText primary={subVital.sub_list} />
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="State"
                      disabled={!isFormEnabled}
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      sx={{
                        "& .MuiInputBase-input.MuiSelect-select": {
                          color: "#000 !important",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                    // error={!!errors.ws_state}
                    // helperText={errors.ws_state}
                    >
                      <MenuItem value="">
                        {selectData.add_state_id || "Select State"}
                      </MenuItem>
                      {stateOptions.map((state) => (
                        <MenuItem key={state.state_id} value={state.state_id}>
                          {state.state_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="District"
                      disabled={!isFormEnabled}
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      sx={{
                        "& .MuiInputBase-input.MuiSelect-select": {
                          color: "#000 !important",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                    // error={!!errors.ws_district}
                    // helperText={errors.ws_district}
                    >
                      <MenuItem value="">
                        {selectData.add_district_id || "Select District"}
                      </MenuItem>
                      {districtOptions.map((district) => (
                        <MenuItem
                          key={district.dist_id}
                          value={district.dist_id}
                        >
                          {district.dist_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      size="small"
                      label="Tehsil"
                      fullWidth
                      disabled={!isFormEnabled}
                      value={selectedTahsil}
                      onChange={(e) => setSelectedTahsil(e.target.value)}
                      sx={{
                        "& .MuiInputBase-input.MuiSelect-select": {
                          color: "#000 !important",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                      error={!!errors.ws_taluka}
                      helperText={errors.ws_taluka}
                    >
                      <MenuItem value="">
                        {selectData.add_tehsil_id || "Select Tehsil"}
                      </MenuItem>
                      {talukaOptions.map((taluka) => (
                        <MenuItem key={taluka.tal_id} value={taluka.tal_id}>
                          {taluka.tahsil_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pin Code *"
                      name="ws_pincode"
                      value={selectData.ws_pincode}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={!!errors.ws_pincode}
                      helperText={errors.ws_pincode}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {isLoaded && (
                      <Autocomplete
                        onLoad={(autocomplete) =>
                          (addressRef.current = autocomplete)
                        }
                        onPlaceChanged={handlePlaceChanged}
                      >
                        <TextField
                          fullWidth
                          label="Workshop Address"
                          name="ws_address"
                          value={gisAddress}
                          onChange={(e) => setGisAddress(e.target.value)}
                          // value={selectData.ws_address}
                          // onChange={handleChange}
                          size="small"
                          disabled={!isFormEnabled}
                          error={!!errors.ws_address}
                          helperText={errors.ws_address}
                        />
                      </Autocomplete>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password *"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={selectData.password || ""}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={!!errors.password}
                      helperText={errors.password}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password *"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={selectData.confirm_password || ""}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
                      error={!!errors.confirm_password}
                      helperText={errors.confirm_password}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isFormEnabled}
                        sx={{
                          backgroundColor:
                            "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                          color: "white",
                          textTransform: "none",
                          borderRadius: "8px",
                          px: 4,
                          py: 1,
                          boxShadow: 3,
                          "&:hover": {
                            backgroundColor:
                              "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            color: "white",
                            boxShadow: 6,
                          },
                          "&:disabled": {
                            backgroundColor: "#f5f5f5",
                            color: "#999",
                            border: "1px solid #ddd",
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={7}>
                <Box sx={{ position: "relative", width: "100%" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search Workshop"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        pr: 4,
                      },
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1439A4",
                    }}
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                // height: 450, // 🔥 Fixed height for table + rows area
                display: "flex",
                flexDirection: "column",
              }}
            >
              {tableLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="200px"
                >
                  <CircularProgress sx={{ color: "#1439A4" }} />
                </Box>
              ) : paginatedData.length === 0 ? (
                <Box textAlign="center" py={2}>
                  No results found
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    overflowX: { xs: "auto", sm: "auto", md: "hidden" },
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Box sx={{ minWidth: 600 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                        color: "white",
                        borderRadius: "20px",
                        px: 1,
                        py: 1,
                        mb: 1,
                        fontFamily: "Roboto,sans-serif",
                        fontSize: "13px",
                        fontWeight: 550,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box sx={{ flex: 0.8, borderRight: "1px solid white" }}>
                        Sr No
                      </Box>
                      <Box sx={{ flex: 2, borderRight: "1px solid white" }}>
                        Workshop Name
                      </Box>
                      <Box sx={{ flex: 2 }}>Registration Number</Box>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        maxHeight: 300,
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      {paginatedData.map((info, index) => {
                        const serialNumber = index + 1 + page * rowsPerPage;

                        return (
                          <Card
                            key={info.ws_pk_id}
                            onClick={() => handleTableRowClick(info)}
                            elevation={0}
                            sx={{
                              mb: 1,
                              display: "flex",
                              borderRadius: "20px",
                              cursor: "pointer",
                              p: 1.5,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              transition: "0.3s",
                              "&:hover": {
                                backgroundColor:
                                  selectedRow === info.ws_pk_id
                                    ? "#d7d7d7ff"
                                    : "#F9FAFB",
                              },
                            }}
                          >
                            <Box sx={{ flex: 0.8, fontSize: "13px" }}>
                              {serialNumber}
                            </Box>
                            <Box
                              sx={{
                                flex: 2,
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {info.Workshop_name}
                            </Box>
                            <Box
                              sx={{
                                flex: 2,
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {info.registration_no}
                            </Box>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                labelDisplayedRows={({ from, to }) =>
                  `${from}–${to} | Page ${page + 1} of ${totalPages}`
                }
              />
            </Box>
          </Box>
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
              <Typography>
                Are you sure you want to delete this workshop?
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                color="inherit"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  setOpenDeleteDialog(false);
                  handleDelete(); // ✅ actual delete call
                }}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddSource;
