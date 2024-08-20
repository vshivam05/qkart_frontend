import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Fetch cart items and product details
    const fetchCartAndProducts = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get(`${config.endpoint}/products`);
        setProducts(productResponse.data);

        // Fetch cart
        const cartResponse = await axios.get(`${config.endpoint}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = generateCartItemsFrom(cartResponse.data, productResponse.data);
        setItems(cartItems);
      } catch (error) {
        enqueueSnackbar("Failed to load cart or products data", { variant: "error" });
      }
    };

    fetchCartAndProducts();
  }, [token, enqueueSnackbar]);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* Add your address management UI here */}
            </Box>

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
