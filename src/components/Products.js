import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Card,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { isToken } from "typescript";
import Cart, { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const token = localStorage.getItem("token");
  // to use snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Original products list fetched from API
  const [productDetails, setProductDetails] = useState([]);
  //  Loading Animation
  const [isLoading, setIsLoading] = useState(false);

  //filtered list after user tried to search somthing by product category/name.
  const [filteredProducts, setFilteredProducts] = useState([]);

  //timer for debounce search
  // const [debounceTime, setDebounceTime]= useState('');
  const [timerId, updateTimerId] = useState("");

  const [items, setItems]= useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);

    try {
      let response = await axios.get(`${config.endpoint}/products`);

      // console.log(response.data);
      setProductDetails(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
    //End loading
    setIsLoading(false);
    // return productDetails;
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    // console.log(text);

    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );

      setFilteredProducts(response.data);
    } catch (error) {
      //https://stackoverflow.com/questions/39153080/how-can-i-get-the-status-code-from-an-http-error-in-axios/39153411#39153411
      // console.log(JSON.stringify(error)); use these two options to tap into error object returned from axios.
      if (error.response) {
        //if product not found, show nothing
        if (error.response.status === 404) {
          setFilteredProducts([]);
          //now since (filteredProduct.length) is zero, hence only no product found will be there :(
        }

        //if server side error, then show full product list
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setFilteredProducts(productDetails);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
    setIsLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeId) => {
    //stored the entered keyword by user

    var text = event.target.value;
    clearTimeout(timerId);
    // console.log("text :");
    // console.log(text);

    //debounce logic
    // if(debounceTimeId){
    //   clearTimeout(debounceTimeId);

    // }

    const newTimeOut = setTimeout(() => {
      performSearch(text);
    }, debounceTimeId);

    updateTimerId(newTimeOut);
  };

  

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };


  const addToCart = async (
    token,
    items,
    productId,
    products,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Please log in to add item to cart", {
        variant: "warning",
      });
      return;
    }     

    if ( options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart slidebar to update quantity or remove item.",
        { variant: "warning" },
      );
      return;
    }


    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartItems = generateCartItemsFrom(response.data, products)
      setItems(cartItems);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend id=s running,reachable and return valid JSON",
          {
            variant: "error",
          }
        );
      }
    }

    console.log("add to cart", token);
  };

  // //intial api call to populate the products on product page
  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    if (productDetails.length) {
       fetchCart(token)
          .then((cartData) => generateCartItemsFrom(cartData, productDetails))
          .then((cartItems) => setItems(cartItems));
    }
 }, [productDetails]);
 

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        {/* <p>hello from product page</p> */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, 500)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, 500)}
      />
      <Grid container>
        <Grid md={token ? 9 : 12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          {isLoading ? (
            <Box
              className="loading"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ margin: "auto" }}
              py={10}
            >
              <CircularProgress size={30} />
              <h4> Loading Products... </h4>
            </Box>
          ) : (
            <Grid
              container
              item
              spacing={2}
              // direction="row"
              // justifyContent="center"
              // alignItems="center"
              my={3}
              marginY="1rem"
              paddingX="1rem"
            >
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item key={product["_id"]} xs={6} md={3}>
                    <ProductCard
                      product={product}
                      //taking _id from above
                      handleAddToCart={(event) =>
                        addToCart(token,items, product["_id"], productDetails, 1, { preventDuplicate: true })
                      }
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  py={10}
                  sx={{ margin: "auto" }}
                >
                  <SentimentDissatisfied size={40} />
                  <h4>No products found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {token ? (
          <Grid item xs={12} md={3} bg="#E9F5E1">
            <Cart products={productDetails} items = {items}  handleQuantity = {addToCart}/>
          </Grid>
        ) : null}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
