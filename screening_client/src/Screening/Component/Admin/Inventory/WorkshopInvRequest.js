import React, { useState } from "react";
import {
    Container, Button, Card, CardContent, Typography,
    Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Tabs, Tab, Box,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Select, Checkbox, ListItemText
} from "@mui/material";
import { Stack } from "react-bootstrap";

const typeMap = {
    Consumable: {
        categories: ["Tablet", "Capsule"],
        items: {
            Tablet: ["Paracetamol", "Vitamin C"],
            Capsule: ["Antibiotic Capsule"]
        },
        units: ["Strip", "Box"]
    },
    "Non-Consumable": {
        categories: ["Gloves", "Bandage"],
        items: {
            Gloves: ["Surgical Gloves", "Latex Gloves"],
            Bandage: ["Elastic Bandage"]
        },
        units: ["Piece", "Box"]
    }
};

export default function InventorySystem() {

    const [tab, setTab] = useState(0);

    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]);
    const [unit, setUnit] = useState("");
    const [quantities, setQuantities] = useState({});

    const [requests, setRequests] = useState([]);

    const [openRequest, setOpenRequest] = useState(false);

    const handleTypeChange = (value) => {
        setType(value);
        setCategory("");
        setItems([]);
        setUnit("");
        setQuantities({});
    };

    const handleItemChange = (value) => {
        setItems(value);
        const qtyObj = {};
        value.forEach((i) => qtyObj[i] = quantities[i] || "");
        setQuantities(qtyObj);
    };

    const handleQtyChange = (item, val) => {
        setQuantities({ ...quantities, [item]: val });
    };

    const handleSubmit = () => {
        const newReq = {
            id: `REQ${requests.length + 1}`,
            type,
            category,
            items: items.map(i => ({ name: i, qty: quantities[i] })),
            unit,
            status: "Pending" // ✅ FIXED HERE
        };

        setRequests([...requests, newReq]);
        resetForm();
    };

    const resetForm = () => {
        setOpenRequest(false);
        setType("");
        setCategory("");
        setItems([]);
        setUnit("");
        setQuantities({});
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "warning";
            case "Approved": return "success";
            case "Rejected": return "error";
            default: return "default";
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ mt: 2, borderRadius: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Requests</Typography>
                        <Button variant="contained" onClick={() => setOpenRequest(true)}>
                            + New Request
                        </Button>
                    </Box>

                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Card elevation={1} sx={{ borderRadius: 2, mb: 2, mt: 2 }}>
                            <Table size="small" sx={{ tableLayout: "fixed", width: "100%", height: "3em" }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: "10%" }}>
                                            <Typography fontWeight={600}>ID</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "15%" }}>
                                            <Typography fontWeight={600}>Type</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "15%" }}>
                                            <Typography fontWeight={600}>Category</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "30%" }}>
                                            <Typography fontWeight={600}>Items (Qty)</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "15%" }}>
                                            <Typography fontWeight={600}>Unit</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "15%" }}>
                                            <Typography fontWeight={600}>Status</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                        {requests.map((r, i) => (
                            <Card key={i} elevation={2} sx={{ borderRadius: 2 }}>
                                <Table size="small" sx={{ tableLayout: "fixed", width: "100%", height: "3em" }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ width: "10%" }}>{r.id}</TableCell>
                                            <TableCell sx={{ width: "15%" }}>{r.type}</TableCell>
                                            <TableCell sx={{ width: "15%" }}>{r.category}</TableCell>
                                            <TableCell sx={{ width: "30%" }}>
                                                {r.items.map(item => `${item.name} (${item.qty})`).join(", ")}
                                            </TableCell>
                                            <TableCell sx={{ width: "15%" }}>{r.unit}</TableCell>
                                            <TableCell sx={{ width: "15%" }}>
                                                <Chip
                                                    label={r.status}
                                                    color={getStatusColor(r.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <Dialog open={openRequest} onClose={resetForm} fullWidth maxWidth="sm">
                <DialogTitle>Raise Request</DialogTitle>
                <DialogContent>

                    <TextField select fullWidth size="small" label="Type" value={type}
                        onChange={(e) => handleTypeChange(e.target.value)} sx={{ mt: 2 }}>
                        <MenuItem value="Consumable">Consumable</MenuItem>
                        <MenuItem value="Non-Consumable">Non Consumable</MenuItem>
                    </TextField>

                    {type && (
                        <TextField select fullWidth size="small" label="Category" value={category}
                            onChange={(e) => setCategory(e.target.value)} sx={{ mt: 2 }}>
                            {typeMap[type].categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    {category && (
                        <Select
                            multiple
                            fullWidth
                            value={items}
                            onChange={(e) => handleItemChange(e.target.value)}
                            renderValue={(selected) => selected.join(", ")}
                            sx={{ mt: 2 }}
                        >
                            {typeMap[type].items[category].map((it) => (
                                <MenuItem key={it} value={it}>
                                    <Checkbox checked={items.includes(it)} />
                                    <ListItemText primary={it} />
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {items.length > 0 && items.map((it) => (
                        <TextField
                            key={it}
                            fullWidth
                            size="small"
                            type="number"
                            label={`${it} Quantity`}
                            value={quantities[it] || ""}
                            onChange={(e) => handleQtyChange(it, e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    ))}

                    {items.length > 0 && (
                        <TextField select fullWidth size="small" label="Unit" value={unit}
                            onChange={(e) => setUnit(e.target.value)} sx={{ mt: 2 }}>
                            {typeMap[type].units.map((u) => (
                                <MenuItem key={u} value={u}>{u}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    {items.length > 0 && (
                        <>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Expected Delivery Date"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 2 }}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                label="Remarks"
                                multiline
                                rows={3}
                                sx={{ mt: 2 }}
                            />
                        </>
                    )}

                </DialogContent>

                <DialogActions>
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!type || !category || items.length === 0 || !unit}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}
