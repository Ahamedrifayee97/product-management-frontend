import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

const CreateProduct = () => {
  const [prodName, setProdName] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleCreate = async () => {
    if (!prodName || !unitCost) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("prod_name", prodName);
    formData.append("unit_cost", unitCost);

    try {
      const response = await axios.post('http://localhost:8080/product/save', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 201) {
        setMessage("✅ Product created successfully!");
        setMessageType("success");
        setProdName('');
        setUnitCost('');
      } else {
        setMessage("❌ Failed to create product.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error while creating product.");
      setMessageType("error");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create Product
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Product Name"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Unit Cost"
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              Create
            </Button>

            {message && (
              <Alert severity={messageType}>
                {message}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProduct;
