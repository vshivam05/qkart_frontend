import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActionArea,
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
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          image={product.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="body2" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="textPrimary" sx={{ fontWeight: "bold" }} mb={1}>
            ${product.cost}
          </Typography>
          <Rating name="read-only" value={product.rating} readOnly  />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button className="button" variant="contained" style={{width:"100%"}}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
