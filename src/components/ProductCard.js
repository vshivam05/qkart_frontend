import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  CardActions,
} from "@mui/material";
import "./ProductCard.css";
import { AddShoppingCart } from "@mui/icons-material";
import { AddShoppingCartOutlined } from "@mui/icons-material";

// ---------dummy data---------
// products = {
//   name: "Tan Leatherette Weekender Duffle",
//   category: "Fashion",
//   cost: 150,
//   rating: 4,
//   image:
//     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   _id: "PmInA797xJhMIPti",
// }

const ProductCard = ({ product, handleAddToCart }) => {
  // console.log(products.cost);
  return (
    <Card className="card">
      <CardMedia
        image={product.image}
        title="green iguana"
        component="img"
        alt={product.name}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography fontWeight="700" paddingY="0.5rem">
          {" "}
          ${product.cost}
        </Typography>
        <Rating
          name="half-rating"
          defaultValue={product.rating}
          precision={0.5}
        />
      </CardContent>
      <CardActions>
        <Button
          className="card-button "
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        ></Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
