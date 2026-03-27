import React, { useState } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TablePagination
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MedicineRegister = () => {
    const [open, setOpen] = useState(false);
    const demoData = [
        { id: 1, type: "Consumable", medicineName: "Paracetamol", quantity: 10, unit: "tablet" },
        { id: 2, type: "Non-Consumable", medicineName: "Syringe", quantity: 50, unit: "box" },
        { id: 3, type: "Non-Consumable", medicineName: "Bandage", quantity: 30, unit: "strip" },
        { id: 4, type: "Non-Consumable", medicineName: "Gloves", quantity: 100, unit: "box" },
        { id: 5, type: "Consumable", medicineName: "Ibuprofen", quantity: 20, unit: "tablet" },
        { id: 6, type: "Consumable", medicineName: "Vitamin C", quantity: 15, unit: "tablet" },
    ];
    const [data, setData] = useState(demoData);
    const [form, setForm] = useState({ type: "", medicineName: "", quantity: "", unit: "" });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3); // show 3 items per page

    const unitOptions = ["ml", "box", "strip", "tablet"];

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = () => {
        setData([...data, { ...form, id: data.length + 1 }]);
        setForm({ type: "", medicineName: "", quantity: "", unit: "" });
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Slice the data for current page
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{mb:1}}>
                        <Typography variant="h6">Medicine Registration</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setOpen(true)}
                            sx={{ textTransform: "none" }} // optional: keeps the text normal case
                        >
                            Add Medicine
                        </Button>
                    </Grid>

                    <Table size="small" sx={{ mt: 1 }}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: 2,
                                overflow: "hidden",
                            }}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f5f7fa", height: "3em" }}>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Unit</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </Card>

                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ border: "none", p: 0 }}>
                                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                            {paginatedData.map((row, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Card
                                                        sx={{
                                                            borderRadius: 2,
                                                            boxShadow: 2,
                                                            p: 1.5,
                                                            borderLeft:
                                                                row.type === "Consumable"
                                                                    ? "4px solid #4caf50"
                                                                    : "4px solid #ff9800"
                                                        }}
                                                    >
                                                        <Grid container alignItems="center" spacing={2}>
                                                            <Grid item xs={12} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">Type</Typography>
                                                                <Typography variant="body2">{row.type}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">Name</Typography>
                                                                <Typography variant="body2">{row.medicineName}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">Quantity</Typography>
                                                                <Typography variant="body2">{row.quantity}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">Unit</Typography>
                                                                <Typography variant="body2">{row.unit || "-"}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={data.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 5, 10]}
                    />
                </CardContent>
            </Card>

            {/* Add Medicine Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Medicine</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={form.type}
                                    label="Type"
                                    onChange={(e) => handleChange("type", e.target.value)}
                                >
                                    <MenuItem value="Consumable">Consumable</MenuItem>
                                    <MenuItem value="Non-Consumable">Non-Consumable</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Medicine Name"
                                value={form.medicineName}
                                onChange={(e) => handleChange("medicineName", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Quantity"
                                type="number"
                                value={form.quantity}
                                onChange={(e) => handleChange("quantity", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Unit</InputLabel>
                                <Select
                                    value={form.unit}
                                    label="Unit"
                                    onChange={(e) => handleChange("unit", e.target.value)}
                                >
                                    {unitOptions.map((unit) => (
                                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button size="small" variant="contained" onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MedicineRegister;