import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Typography,
  TablePagination,
  Box,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/product/products");
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      fetchAllProducts();
      return;
    }
    try {
      const res = await axios.get("http://localhost:8080/product/get", {
        params: { prod_name: searchName },
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.prod_id);
    setEditName(product.prodName);
    setEditCost(product.unitCost);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put("http://localhost:8080/product/update", {
        prod_id: id,
        prodName: editName,
        unitCost: editCost,
      });
      setEditingId(null);
      fetchAllProducts();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8080/product/delete", {
        data: { prod_id: id },
      });
      fetchAllProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        <TextField
          label="Search Product"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={fetchAllProducts}>
          <ClearIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Price (₹)</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((prod) => (
                <TableRow key={prod.prod_id}>
                  <TableCell>
                    {editingId === prod.prod_id ? (
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                      />
                    ) : (
                      prod.prodName
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === prod.prod_id ? (
                      <TextField
                        value={editCost}
                        onChange={(e) => setEditCost(e.target.value)}
                        type="number"
                        size="small"
                      />
                    ) : (
                      `₹${prod.unitCost}`
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {editingId === prod.prod_id ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton onClick={() => handleUpdate(prod.prod_id)} color="success">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton onClick={() => setEditingId(null)}>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => startEdit(prod)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(prod.prod_id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
}

export default ProductTable;
