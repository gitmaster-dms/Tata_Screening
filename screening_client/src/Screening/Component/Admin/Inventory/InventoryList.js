import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    TextField,
    Grid,
    MenuItem,
    Chip,
    IconButton,
    Paper,
    Stack,
    Avatar,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { motion, AnimatePresence } from "framer-motion";

const MotionPaper = motion(Paper);

export default function InventoryList() {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});

    const initialForm = {
        itemName: "",
        category: "",
        batch: "",
        mfg: "",
        exp: "",
        supplier: "",
        qtyTotal: "",
        qtyAvailable: "",
        price: "",
        purchaseDate: "",
        unit: "",
        status: "Active",
    };

    const [form, setForm] = useState(initialForm);

    const [data, setData] = useState([
        {
            id: 1,
            itemName: "Paracetamol",
            category: "Medicine",
            batch: "B123",
            mfg: "2025-01-01",
            exp: "2027-01-01",
            supplier: "ABC Pharma",
            qtyTotal: 100,
            qtyAvailable: 80,
            price: 50,
            purchaseDate: "2025-02-01",
            unit: "Box",
            status: "Active",
        },
        {
            id: 2,
            itemName: "Syringe",
            category: "Consumable",
            batch: "S456",
            mfg: "2025-03-01",
            exp: "2028-03-01",
            supplier: "MediSupply",
            qtyTotal: 200,
            qtyAvailable: 150,
            price: 10,
            purchaseDate: "2025-03-10",
            unit: "Piece",
            status: "Active",
        },
        {
            id: 3,
            itemName: "Glucose",
            category: "Consumable",
            batch: "G789",
            mfg: "2025-02-15",
            exp: "2026-02-15",
            supplier: "HealthCare Ltd",
            qtyTotal: 50,
            qtyAvailable: 20,
            price: 120,
            purchaseDate: "2025-02-20",
            unit: "Bottle",
            status: "Active",
        },
        {
            id: 3,
            itemName: "Glucose",
            category: "Consumable",
            batch: "G789",
            mfg: "2025-02-15",
            exp: "2026-02-15",
            supplier: "HealthCare Ltd",
            qtyTotal: 50,
            qtyAvailable: 20,
            price: 120,
            purchaseDate: "2025-02-20",
            unit: "Bottle",
            status: "Active",
        },
        {
            id: 3,
            itemName: "Glucose",
            category: "Consumable",
            batch: "G789",
            mfg: "2025-02-15",
            exp: "2026-02-15",
            supplier: "HealthCare Ltd",
            qtyTotal: 50,
            qtyAvailable: 20,
            price: 120,
            purchaseDate: "2025-02-20",
            unit: "Bottle",
            status: "Active",
        },
    ]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let temp = {};
        if (!form.itemName) temp.itemName = "Required";
        if (!form.batch) temp.batch = "Required";
        if (!form.category) temp.category = "Select category";
        if (!form.unit) temp.unit = "Select unit";
        if (!form.qtyTotal) temp.qtyTotal = "Required";
        if (!form.qtyAvailable) temp.qtyAvailable = "Required";
        if (!form.exp) temp.exp = "Required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        if (isEdit) {
            setData((prev) => prev.map((item) => (item.id === editId ? { ...form, id: editId } : item)));
        } else {
            setData((prev) => [{ ...form, id: Date.now() }, ...prev]);
        }

        handleClose();
    };

    const handleEdit = (item) => {
        setForm(item);
        setIsEdit(true);
        setEditId(item.id);
        setOpen(true);
    };

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const handleClose = () => {
        setOpen(false);
        setForm(initialForm);
        setIsEdit(false);
        setEditId(null);
        setErrors({});
    };

    const getIcon = (category) => {
        if (category === "Medicine") return <MedicalServicesIcon fontSize="small" />;
        if (category === "Consumable") return <Inventory2Icon fontSize="small" />;
        return <LocalShippingIcon fontSize="small" />;
    };

    return (
        <Box sx={{ p: 3, ml: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
                <Typography fontWeight={700} fontSize={22}>
                    Inventory Stock List
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search item or supplier"
                    // value={searchText}
                    // onChange={(e) => setSearchText(e.target.value)}
                    />

                    {/* Category Filter */}
                    <TextField
                        select
                        size="small"
                        // value={filterCategory}
                        // onChange={(e) => setFilterCategory(e.target.value)}
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Medicine">Medicine</MenuItem>
                        <MenuItem value="Consumable">Consumable</MenuItem>
                    </TextField>

                    {/* Add Item Button */}
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Add Stock
                    </Button>
                </Stack>
            </Stack>

            {/* GRID LIST */}
            <Grid container spacing={2}>
                <AnimatePresence>
                    {data.map((item) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Box sx={{ p: 2, borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <motion.div animate={{ rotate: [0, 360] }}>
                                            <Avatar>{getIcon(item.category)}</Avatar>
                                        </motion.div>
                                        <Box flex={1}>
                                            <Typography fontWeight={600} fontSize={14} noWrap>
                                                {item.itemName}
                                            </Typography>
                                            <Typography fontSize={11} color="gray" noWrap>
                                                {item.batch} • {item.unit}
                                            </Typography>
                                        </Box>
                                        <Chip label={item.status} size="small" color={item.status === 'Active' ? 'success' : 'default'} />
                                    </Stack>

                                    <Box mt={1}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography fontSize={12}>₹ {item.price}</Typography>
                                            <Typography fontSize={12}>Qty: {item.qtyAvailable}/{item.qtyTotal}</Typography>
                                            <Typography fontSize={11} color="orange">Exp: {item.exp}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" mt={0.5}>
                                            <Typography fontSize={11} color="gray">MFG: {item.mfg || '-'}</Typography>
                                            <Typography fontSize={11} color="gray">Purchase: {item.purchaseDate || '-'}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" mt={0.5}>
                                            <Typography fontSize={11} color="gray">Category: {item.category}</Typography>
                                            <Typography fontSize={11} color="gray">Supplier: {item.supplier}</Typography>
                                        </Stack>
                                    </Box>

                                    <Stack direction="row" justifyContent="flex-end" mt={1} spacing={1}>
                                        <IconButton size="small" onClick={() => handleEdit(item)}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(item.id)}>
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Grid>
                        );
                    })}
                </AnimatePresence>
            </Grid>

            {/* MODAL */}
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogContent>
                    <Typography fontWeight={600} mb={1}>
                        {isEdit ? "Update Inventory" : "Add Inventory"}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} error={!!errors.itemName} helperText={errors.itemName} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Batch" name="batch" value={form.batch} onChange={handleChange} error={!!errors.batch} helperText={errors.batch} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                error={!!errors.category}
                                helperText={errors.category}
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                <MenuItem value="Medicine">Medicine</MenuItem>
                                <MenuItem value="Consumable">Consumable</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Unit"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                error={!!errors.unit}
                                helperText={errors.unit}
                                InputLabelProps={{ shrink: true }} // important inside Dialog
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (selected) => (selected ? selected : "Select Unit"),
                                }}
                            >
                                <MenuItem value="">Select Unit</MenuItem>
                                <MenuItem value="Piece">Piece</MenuItem>
                                <MenuItem value="Box">Box</MenuItem>
                                <MenuItem value="Bottle">Bottle</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField size="small" type="date" fullWidth label="MFG Date" InputLabelProps={{ shrink: true }} name="mfg" value={form.mfg} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField size="small" type="date" fullWidth label="Expiry Date" InputLabelProps={{ shrink: true }} name="exp" value={form.exp} onChange={handleChange} error={!!errors.exp} helperText={errors.exp} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Supplier" name="supplier" value={form.supplier} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Total Quantity" name="qtyTotal" value={form.qtyTotal} onChange={handleChange} error={!!errors.qtyTotal} helperText={errors.qtyTotal} />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Available Quantity" name="qtyAvailable" value={form.qtyAvailable} onChange={handleChange} error={!!errors.qtyAvailable} helperText={errors.qtyAvailable} />
                        </Grid> */}
                        <Grid item xs={6}>
                            <TextField size="small" fullWidth label="Price" name="price" value={form.price} onChange={handleChange} />
                        </Grid>
                         <Grid item xs={6}>
                            <TextField size="small" type="date" fullWidth label="Stock Added Date" InputLabelProps={{ shrink: true }} name="exp" value={form.exp} onChange={handleChange} error={!!errors.exp} helperText={errors.exp} />
                        </Grid>
                        <Grid item xs={4} alignItems="center">
                            <Button fullWidth variant="contained" onClick={handleSubmit}>
                                {isEdit ? "Update Item" : "Save Item"}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
}