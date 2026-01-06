import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AddSource.css";
import {
  Box,
  Grid,
  Button,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  CircularProgress,
  Paper,
  Typography,
  MenuItem,
  InputLabel,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Modal } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";
import {
  DriveFileRenameOutlineOutlined,
  DeleteOutlineOutlined,
  Add,
} from "@mui/icons-material";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Snackbar, Alert } from "@mui/material";

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const userID = localStorage.getItem("userID");
  console.log(userID);
  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  /// State District Tehsil
  const State = localStorage.getItem("StateLogin");
  const District = localStorage.getItem("DistrictLogin");
  const Tehsil = localStorage.getItem("TehsilLogin");

  //permission code start
  const [canAddSource, setCanAddSource] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
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
          m.moduleName === "Source" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Add")
      )
    );
    setCanAddSource(hasAddCitizenPermission);
    // Check if the user has permission for the "Delete" submodule
    const hasDeletePermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Source" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Delete")
      )
    );
    setCanDelete(hasDeletePermission);

    // Check if the user has permission for the "edit" submodule

    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Source" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Edit")
      )
    );
    setCanEdit(hasEditPermission);
  }, []);
  //permission code end

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false); /////// model
  const [showModalExist, setShowModalExist] = useState(false); /////// model
  const [tableinfo, setTableInfo] = useState([]); /// data in table variable
  console.log(tableinfo, "tableinfor");
  const [workshopList, setWorkshopList] = useState([]);
  console.log("workshopList", workshopList);

  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  ////////////////////// Form Dropdown /////////////////
  const [dropdownSource, setDropdownSource] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  console.log(stateOptions, "stateoptions");

  const [districtOptions, setDistrictOptions] = useState([]);
  const [talukaOptions, setTalukaOptions] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTahsil, setSelectedTahsil] = useState("");
  ////////////////////////////////////////////////////////////

  const [isFormEnabled, setFormEnabled] = useState(false); //Form Disable
  //////////////////////////// Nav Dropdown //////////////////////////
  const [sourceNav, setSourceNav] = useState([]); // State for source options
  const [selectedSource, setSelectedSource] = useState(SourceUrlId || ""); // State to store selected source

  const [sourceStateNav, setSourceStateNav] = useState([]); // State for source state options
  const [selectedStateNav, setSelectedStateNav] = useState("");
  console.log(sourceStateNav, "sourceStateNav");

  const [sourceDistrictNav, setSourceDistrictNav] = useState([]); // State for source district options
  const [selectedDistrictNav, setSelectedDistrictNav] = useState("");

  const [sourceTehsilNav, setSourceTehsilNav] = useState([]); // District for source Tehsil options
  const [selectedTehsilNav, setSelectedTehsilNav] = useState("");

  const [sourceName, setSourceName] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  console.log(
    selectedSource,
    selectedStateNav,
    selectedDistrictNav,
    selectedTehsilNav,
    selectedName
  );

  const [updateSrc, setUpdateSrc] = useState(true);
  const [deleteSrc, setDeleteSrc] = useState(true);

  const [updateModel, setUpdateModel] = useState(false); /////// model
  const [deleteModel, setDeleteModel] = useState(false); /////// model
  const [showModalMissing, setShowModalMissing] = useState(false); /////// model

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  //_____________________________________VITALS API OF DROPDOWN_______________________________
  const [screeningVitals, setScreeningVitals] = useState([]);
  const [subScreening, setSubScreening] = useState([]);
  const [selectedVitals, setSelectedVitals] = useState([]);
  console.log(selectedVitals, "vitals name fetching......");

  const [selectedSubVitals, setSelectedSubVitals] = useState([]);
  console.log(selectedSubVitals, "selected sub vitals name");
  const [selectedVitalId, setSelectedVitalId] = useState(null);

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
          }
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
        (vital) => vital.sc_list_pk_id === 5
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
            }
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

  const displayedData = Array.isArray(tableinfo)
    ? tableinfo.filter((data) =>
        Object.values(data)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  const [selectedFile, setSelectedFile] = useState(null);

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
  });

  const validateForm = () => {
    const newErrors = {};

    if (!selectData.source) {
      newErrors.source = "Source is required";
    }

    if (!selectData.source_names) {
      newErrors.source_names = "Source Name is required";
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

    // if (!selectData.source_pincode) {
    //     newErrors.source_pincode = 'Pin Code is required';
    // }

    if (!selectData.source_pincode) {
      newErrors.source_pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(selectData.source_pincode)) {
      newErrors.source_pincode = "Invalid Pincode";
    }

    // else if (!/^\d{6}$/.test(selectData.source_pincode)) {
    //     newErrors.source_pincode = 'Invalid pin code format.';
    // }

    if (!selectData.source_address) {
      newErrors.source_address = "Address is required";
    }
    setErrors(newErrors);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "screening_vitals") {
      setSelectedVitals(e.target.value);
    } else if (name === "sub_screening_vitals") {
      setSelectedSubVitals(e.target.value);
    } else {
      console.log(`Updating field ${name} with value:`, value);
      setSelectData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    console.log("Updated selectData:", selectData);
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

  //////// POST API for source /////////////
  const [selectData, setSelectData] = useState({
    // Pass static community/source id 6 to backend (hidden on frontend)
    pk_id: "",

    source: "6",
    Workshop_name: "",
    registration_no: "",
    mobile_no: "",
    email_id: "",
    // Registration_details: null, // Assuming Registration_details is a File object
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
  });
  console.log(selectData, "selectedData");

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
        JSON.stringify(selectedVitals) || "[]"
      );
      formData.append(
        "sub_screening_vitals",
        JSON.stringify(selectedSubVitals) || "[]"
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
        if (!updateSrc) {
          try {
            formData.append("modify_by", userID);

            const response = await fetch(
              `${Port}/Screening/Workshop_Update/${selectedRow}/`,
              {
                method: "PUT",
                body: formData,
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (response.status === 200) {
              const result = await response.json();
              const data = result.data; // 👈 Important

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
              resetForm(); // now it truly resets the form
              // Success message
              setSnackbarMessage("Workshop updated successfully!");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              // ✅ Do NOT resetForm() here
            } else {
              setSnackbarMessage(
                `Error updating source. Status: ${response.status}`
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
    } else {
      setSnackbarMessage("Form has errors. Please correct them.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  /////////////// modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  ////////////// modal  missing
  const handleMissing = () => {
    setShowModalMissing(false);
  };

  ////////////// modal  Exist
  const handleExist = () => {
    setShowModalExist(false);
  };

  ////////////// Update  missing
  const handleUpdate = () => {
    setUpdateModel(false);
  };

  ////////////// Delete  missing
  const handleDeleteModel = () => {
    setDeleteModel(false);
  };

  const [getid, setidws] = useState([]);
  ///////// get API for Table //////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Port}/Screening/Workshop_Get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setWorkshopList(data);
        setidws(data.ws_pk_id);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching source data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          (item) => item.source_pk_id !== selectData.source_pk_id
        )
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

  //////////////// Form Disable ////////////////
  const handleClicked = () => {
    setFormEnabled(true);
    setUpdateSrc(true);
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
  ///// source Dropdown
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

  //// Soure State against selected source
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${Port}/Screening/State_Get/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setStateOptions(data); // ✅ sets options for form dropdown
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  //// Soure District against selected source state/////////
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) return; // wait until a state is selected
      try {
        const res = await fetch(
          `${Port}/Screening/District_Get/${selectedState}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json();
        setDistrictOptions(data);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  //// Soure Tehsil against selected source District/////////
  useEffect(() => {
    const fetchTehsils = async () => {
      if (!selectedDistrict) return; // wait until a district is selected
      try {
        const res = await fetch(
          `${Port}/Screening/Tehsil_Get/${selectedDistrict}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json();
        setTalukaOptions(data);
      } catch (err) {
        console.error("Error fetching tehsils:", err);
      }
    };
    fetchTehsils();
  }, [selectedDistrict]);

  //// Soure Name against selected source district
  // useEffect(() => {
  //     const fetchSourceNameOptions = async () => {
  //         if ( selectedStateNav && selectedDistrictNav && selectedTehsilNav) {
  //             try {
  //                 const res = await fetch(`${Port}/Screening/Tehsil_Get/${selectedDistrictNav}/${selectedTehsilNav}`, {
  //                     headers: {
  //                         'Authorization': `Bearer ${accessToken}`,
  //                     },
  //                 });
  //                 const data = await res.json();
  //                 setSourceName(data);
  //             } catch (error) {
  //                 console.error("Error fetching Source Name against Tehsil data:", error);
  //             }
  //         }
  //     };
  //     fetchSourceNameOptions();
  // }, [selectedTehsilNav, selectedStateNav, selectedDistrictNav, selectedTehsilNav]);

  ///////// State, District, Tehsil Form Dropdown /////////////

  ////////////////////// search Filter
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();

      // 🔥 backend ke exact params
      if (selectedWorkshopId) params.append("ws_pk_id", selectedWorkshopId);
      if (selectedStateNav) params.append("ws_state", selectedStateNav);
      if (selectedDistrictNav)
        params.append("ws_district", selectedDistrictNav);
      if (selectedTehsilNav) params.append("ws_tehsil", selectedTehsilNav);

      const apiUrl = `${Port}/Screening/workshop_filter_api/?${params.toString()}`;

      const accessToken = localStorage.getItem("token");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTableInfo(Array.isArray(response.data) ? response.data : []);
      console.log("Filtered data:", response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
      setTableInfo([]);
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
        }
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
      setSelectedVitals(data.screening_vitals || []);
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

  useEffect(() => {
    if (stateOptions.length && editData?.ws_state) {
      setSelectedState((editData.ws_state));
    }
  }, [stateOptions]);
  useEffect(() => {
    if (districtOptions.length && editData?.ws_district) {
      setSelectedDistrict(Number(editData.ws_district));
    }
  }, [districtOptions]);

  useEffect(() => {
    if (talukaOptions.length && editData?.ws_taluka) {
      setSelectedTahsil(Number(editData.ws_taluka));
    }
  }, [talukaOptions]);

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
                  value={selectedStateNav}
                  onChange={(event) => setSelectedStateNav(event.target.value)}
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
                  {/* {sourceStateNav.map((drop) => (
                    <MenuItem key={drop.state_id} value={drop.state_id}>
                      {drop.state_name}
                    </MenuItem>
                  ))} */}
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
                  value={selectedDistrictNav}
                  onChange={(event) =>
                    setSelectedDistrictNav(event.target.value)
                  }
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
                  {sourceDistrictNav.map((drop) => (
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
                  value={selectedTehsilNav}
                  onChange={(event) => setSelectedTehsilNav(event.target.value)}
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
                  {sourceTehsilNav.map((drop) => (
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
                  <Add
                    sx={iconBlue}
                    onClick={() => {
                      setFormEnabled(true);
                      setUpdateSrc(true); // ✅ ADD MODE
                      resetForm();
                    }}
                  />
                  {/* {canEdit && selectedRow && ( */}
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
                    onClick={() => {
                      setFormEnabled(true);
                      setUpdateSrc(false);
                    }}
                  />
                  {/* )} */}
                  {/* {canDelete && ( */}
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
                    onClick={() => {
                      setDeleteSrc(false);
                      handleDelete();
                    }}
                  />
                  {/* )} */}
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

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small" disabled={!isFormEnabled}>
                                            <InputLabel>Workshop *</InputLabel>
                                            <Select
                                                name="source"
                                                value={selectData.source}
                                                onChange={handleChange}
                                                label="Source"
                                                sx={{
                                                    "& .MuiInputBase-input.MuiSelect-select": {
                                                        color: "#000 !important",
                                                    },
                                                    "& .MuiSvgIcon-root": {
                                                        color: "#000",
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    {selectData.add_source_id || "Select Source"}
                                                </MenuItem>
                                                {dropdownSource.map((option) => (
                                                    <MenuItem key={option.source_pk_id} value={option.source_pk_id}>
                                                        {option.source}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid> */}

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
                    />
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
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email ID *"
                      name="email_id"
                      value={selectData.email_id}
                      onChange={handleChange}
                      size="small"
                      disabled={!isFormEnabled}
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
                    <FormControl
                      fullWidth
                      size="small"
                      disabled={!isFormEnabled}
                    >
                      <InputLabel>Vitals *</InputLabel>
                      <Select
                        multiple
                        value={selectedVitals}
                        onChange={handleChange}
                        name="screening_vitals"
                        renderValue={(selected) =>
                          selected
                            .map((val) => {
                              const vital = screeningVitals.find(
                                (v) => v.sc_list_pk_id === val
                              );
                              return vital ? vital.screening_list : "";
                            })
                            .join(", ")
                        }
                        sx={{
                          "& .MuiInputBase-input.MuiSelect-select": {
                            color: "#000 !important",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#000",
                          },
                        }}
                      >
                        {screeningVitals.map((vital) => (
                          <MenuItem
                            key={vital.sc_list_pk_id}
                            value={vital.sc_list_pk_id}
                          >
                            <Checkbox
                              checked={
                                selectedVitals.indexOf(vital.sc_list_pk_id) > -1
                              }
                            />
                            {vital.screening_list}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedVitalId === 5 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        disabled={!isFormEnabled}
                      >
                        <InputLabel>Sub Vitals *</InputLabel>
                        <Select
                          multiple
                          value={selectedSubVitals}
                          onChange={handleChange}
                          name="sub_screening_vitals"
                          renderValue={(selected) =>
                            selected
                              .map((val) => {
                                const subVital = subScreening.find(
                                  (v) => v.sc_sub_list_pk_id === val
                                );
                                return subVital ? subVital.sub_list : "";
                              })
                              .join(", ")
                          }
                          sx={{
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                        >
                          {subScreening.map((subVital) => (
                            <MenuItem
                              key={subVital.sc_sub_list_pk_id}
                              value={subVital.sc_sub_list_pk_id}
                            >
                              <Checkbox
                                checked={
                                  selectedSubVitals.indexOf(
                                    subVital.sc_sub_list_pk_id
                                  ) > -1
                                }
                              />
                              {subVital.sub_list}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="State *"
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
                      label="District *"
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
                      label="Tehsil *"
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
                          label="Address *"
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
              {canAddSource && (
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => {
                      handleClicked();
                      resetForm();
                    }}
                    sx={{
                      background:
                        "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                      textTransform: "none",
                      borderRadius: "10px",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                      },
                    }}
                  >
                    + Add New Workshop
                  </Button>
                </Grid>
              )}

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

            <Box>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="200px"
                >
                  <CircularProgress sx={{ color: "#1439A4" }} />
                </Box>
              ) : displayedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                <Box>
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
                      mb: 2,
                      fontFamily: "Roboto,sans-serif",
                      fontSize: "13px",
                      fontWeight: 550,
                      textAlign: "center",
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

                  <Box>
                    {displayedData
                      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((info, index) => {
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
                              border: "none",
                              boxShadow: "none",
                              cursor: "pointer",
                              transition: "0.3s",
                              p: 1.5,
                              textAlign: "center",

                              borderRadiusTopleft:
                                selectedRow === info.ws_pk_id
                                  ? "2px solid red"
                                  : "0px",
                              backgroundColor:
                                selectedRow === info.ws_pk_id
                                  ? "white"
                                  : "white",
                              "&:hover": {
                                backgroundColor:
                                  selectedRow === info.ws_pk_id
                                    ? "#d7d7d7ff"
                                    : "#F9FAFB",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                flex: 0.8,
                                fontFamily: "Roboto,sans-serif",
                                fontSize: "13px",
                                fontWeight: 50,
                              }}
                            >
                              {serialNumber}
                            </Box>
                            <Box
                              sx={{
                                flex: 2,
                                fontFamily: "Roboto,sans-serif",
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {info.Workshop_name}
                            </Box>
                            <Box
                              sx={{
                                flex: 2,
                                fontFamily: "Roboto,sans-serif",
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
              )}

              {/* Pagination */}
              <TablePagination
                component="div"
                count={displayedData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                sx={{
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.875rem",
                    },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddSource;
