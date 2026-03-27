import React, { useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    TextField,
    IconButton,
    Tooltip,
    Chip,
    DialogActions,
    Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Card } from "react-bootstrap";

const initialRequests = [
    // Workshop A
    { id: 1, status: "Pending", state: "MH", district: "Pune", itemName: "Tablet A1", quantity: 50, batch: "B101", requestedBy: "Workshop A", date: "2026-03-17", status: "Pending", remark: "" },
    { id: 2, status: "Approve", state: "MH", district: "Pune", itemName: "Tablet A2", quantity: 30, batch: "B102", requestedBy: "Workshop A", date: "2026-03-17", status: "Pending", remark: "" },
    { id: 5, status: "Pending", state: "MH", district: "MH", itemName: "Tablet A5", quantity: 25, batch: "B105", requestedBy: "Workshop A", date: "2026-03-17", status: "Pending", remark: "" },

    // Workshop B
    { id: 6, status: "Approve", state: "MH", district: "Pune", itemName: "Syringe B1", quantity: 100, batch: "S201", requestedBy: "Workshop B", date: "2026-03-16", status: "Pending", remark: "" },
    { id: 9, status: "Pending", state: "MH", district: "Pune", itemName: "Syringe B4", quantity: 60, batch: "S204", requestedBy: "Workshop B", date: "2026-03-16", status: "Pending", remark: "" },

    // Workshop C
    { id: 10, status: "Approve", state: "MH", district: "Pune", itemName: "Glucose C1", quantity: 30, batch: "G301", requestedBy: "Workshop C", date: "2026-03-15", status: "Pending", remark: "" },
];

export default function ApprovalTable() {
    const [requests, setRequests] = useState(initialRequests);
    const [openRemarkModal, setOpenRemarkModal] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [currentWorkshop, setCurrentWorkshop] = useState("");

    const handleOpenRemarkModal = (request) => {
        setCurrentRequest(request);
        setOpenRemarkModal(true);
    };

    const handleCloseRemarkModal = () => {
        setOpenRemarkModal(false);
        setCurrentRequest(null);
    };

    const handleRemarkChange = (value) => {
        setCurrentRequest((prev) => ({ ...prev, remark: value }));
    };

    const handleSubmitRemark = () => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === currentRequest.id
                    ? { ...r, status: currentRequest.actionType === "approve" ? "Approved" : "Rejected", remark: currentRequest.remark }
                    : r
            )
        );
        handleCloseRemarkModal();
    };

    const handleAction = (request, actionType) => {
        setCurrentRequest({ ...request, actionType });
        handleOpenRemarkModal({ ...request, actionType });
    };

    const handleOpenViewModal = (workshop) => {
        setCurrentWorkshop(workshop);
        setOpenViewModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setCurrentWorkshop("");
    };

    const handleApproveWorkshop = () => {
        setRequests((prev) =>
            prev.map((r) =>
                r.requestedBy === currentWorkshop
                    ? { ...r, status: "Approved" }
                    : r
            )
        );
        handleCloseViewModal();
    };

    const handleRejectWorkshop = () => {
        setRequests((prev) =>
            prev.map((r) =>
                r.requestedBy === currentWorkshop
                    ? { ...r, status: "Rejected" }
                    : r
            )
        );
        handleCloseViewModal();
    };

    const workshopItems = (workshop) => requests.filter((r) => r.requestedBy === workshop);

    return (
        <Box sx={{ p: 1, ml: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Workshop Requested Items
            </Typography>

            <Table sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={6} sx={{ border: "none", p: 1 }}>
                            <Paper
                                elevation={1}
                                sx={{ borderRadius: 2, px: 2, py: 1, bgcolor: "#f5f7fa" }}
                            >
                                <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                                    <TableRow>
                                        <TableCell sx={{ width: "16%" }}><b>State</b></TableCell>
                                        <TableCell sx={{ width: "16%" }}><b>District</b></TableCell>
                                        <TableCell sx={{ width: "20%" }}><b>Workshop Name</b></TableCell>
                                        <TableCell sx={{ width: "18%" }}><b>Requested Date</b></TableCell>
                                        <TableCell sx={{ width: "15%" }}><b>Status</b></TableCell>
                                        <TableCell sx={{ width: "15%" }} align="center"><b>Action</b></TableCell>
                                    </TableRow>
                                </Table>
                            </Paper>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell colSpan={6} sx={{ border: "none", p: 0 }}>
                                <Card elevation={1} sx={{ borderRadius: 2, my: 0 }}>
                                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                                        <TableRow hover>
                                            <TableCell sx={{ width: "16%" }}>{req.state}</TableCell>
                                            <TableCell sx={{ width: "16%" }}>{req.district}</TableCell>
                                            <TableCell sx={{ width: "20%" }}>{req.requestedBy}</TableCell>
                                            <TableCell sx={{ width: "18%" }}>{req.date}</TableCell>
                                            <TableCell sx={{ width: "15%" }}>
                                                <Chip
                                                    label={req.status}
                                                    color={
                                                        req.status === "Approved"
                                                            ? "success"
                                                            : req.status === "Rejected"
                                                                ? "error"
                                                                : "warning"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ width: "15%" }} align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="View Workshop Items">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleOpenViewModal(req.requestedBy)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    </Table>
                                </Card>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Remark Modal */}
            <Dialog open={openRemarkModal} onClose={handleCloseRemarkModal} fullWidth maxWidth="sm">
                <DialogTitle>{currentRequest?.actionType === "approve" ? "Approve Item" : "Reject Item"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Enter remark"
                        value={currentRequest?.remark || ""}
                        onChange={(e) => handleRemarkChange(e.target.value)}
                    />
                    <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
                        <Button onClick={handleCloseRemarkModal}>Cancel</Button>
                        <Button
                            variant="contained"
                            color={currentRequest?.actionType === "approve" ? "success" : "error"}
                            onClick={handleSubmitRemark}
                        >
                            Submit
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="md">

                {/* HEADER */}
                <DialogTitle>
                    Workshop Request Details
                </DialogTitle>

                <DialogContent>

                    {/* TOP INFO SECTION */}
                    <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>

                        <Grid item xs={4}>
                            <TextField
                                label="State"
                                // value={selectedData?.state}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="District"
                                // value={selectedData?.district}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Workshop Name"
                                // value={selectedData?.workshopName}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Expected Delivery Date"
                                // value={selectedData?.deliveryDate}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Remarks"
                                // value={selectedData?.remarks}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                    </Grid>

                    <Table size="small" sx={{ backgroundColor: "#fff" }}>
                        <TableHead sx={{ bgcolor: "#f5f7fa" }}>
                            <TableRow>
                                <TableCell><b>Item Name</b></TableCell>
                                <TableCell align="center"><b>Requested Qty</b></TableCell>
                                <TableCell><b>Batch</b></TableCell>
                                <TableCell align="center"><b>Available Stock</b></TableCell>
                                <TableCell align="center"><b>Status</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {workshopItems(currentWorkshop).map((item) => {
                                const availableStock = item.availableStock || 0;

                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell>{item.batch}</TableCell>

                                        <TableCell align="center">
                                            <b style={{ color: availableStock > 0 ? "#2e7d32" : "#d32f2f" }}>
                                                {availableStock}
                                            </b>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={item.status}
                                                color={
                                                    item.status === "Approved"
                                                        ? "success"
                                                        : item.status === "Rejected"
                                                            ? "error"
                                                            : "warning"
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                </DialogContent>

                {/* ACTION BUTTONS */}
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={handleCloseViewModal}>
                        Close
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRejectWorkshop}
                    >
                        Reject
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleApproveWorkshop}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="md">
                <DialogTitle>
                    Items Requested by {currentWorkshop}
                </DialogTitle>

                <DialogContent>
                    <Table sx={{ mt: 1, backgroundColor: "#fff" }}>

                        <TableHead sx={{ bgcolor: "#f5f7fa" }}>
                            <TableRow>
                                <TableCell><b>Item Name</b></TableCell>
                                <TableCell align="center"><b>Requested Qty</b></TableCell>
                                <TableCell><b>Batch</b></TableCell>
                                <TableCell align="center"><b>Available Stock</b></TableCell>
                                <TableCell align="center"><b>Give Quantity</b></TableCell>
                                <TableCell align="center"><b>Status</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {workshopItems(currentWorkshop).map((item) => {
                                const availableStock = item.availableStock || 0;

                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell>{item.batch}</TableCell>
                                        <TableCell align="center">
                                            <b style={{ color: availableStock > 0 ? "#2e7d32" : "#d32f2f" }}>
                                                {availableStock}
                                            </b>
                                        </TableCell>

                                        <TableCell align="center">
                                            <TextField
                                                size="small"
                                                placeholder="Qty"
                                                type="number"
                                                disabled={availableStock === 0}
                                                sx={{ maxWidth: "100px" }}
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={item.status}
                                                color={
                                                    item.status === "Approved"
                                                        ? "success"
                                                        : item.status === "Rejected"
                                                            ? "error"
                                                            : "warning"
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" color="error">
                        Reject
                    </Button>

                    <Button variant="contained" color="success">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog> */}
        </Box>
    );
}