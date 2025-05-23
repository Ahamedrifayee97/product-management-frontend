// App.jsx (main entry)
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import CreateProduct from "./components/product/CreateProduct";
import ProductList from "./components/product/ProductList";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
          <Tab label="Create Product" />
          <Tab label="View Products" />
        </Tabs>

        <Box mt={4}>
          {tab === 0 && <CreateProduct />}
          {tab === 1 && <ProductList />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;