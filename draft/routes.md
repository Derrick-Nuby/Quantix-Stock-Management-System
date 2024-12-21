# API Routes Documentation

## Product Management

### 1. Create Product

- Method: POST
- Route: `/api/products`
- Description: Create a new product
- Request Body:

```json
{
  "name": "string",
  "image": "base64string",
  "buyingPrice": "number",
  "sellingPrice": "number",
  "categoryId": "string?",
  "inStock": "number"
}
```

- Response: Returns created product object

### 2. Get All Products

- Method: GET
- Route: `/api/products`
- Description: Get all products with optional filtering
- Query Parameters: `?category=categoryId&inStock=true&page=1&limit=10`
- Response: Returns paginated list of products

### 3. Get Single Product

- Method: GET
- Route: `/api/products/{id}`
- Description: Get detailed information about a specific product
- Response: Returns product object with sales history

### 4. Update Product

- Method: PUT
- Route: `/api/products/{id}`
- Description: Update product information
- Request Body: Same as Create Product
- Response: Returns updated product object

### 5. Delete Product

- Method: DELETE
- Route: `/api/products/{id}`
- Description: Soft delete a product
- Response: Returns success message

## Category Management

### 6. Create Category

- Method: POST
- Route: `/api/categories`
- Description: Create a new category or subcategory
- Request Body:

```json
{
  "name": "string",
  "parentId": "string?"
}
```

- Response: Returns created category object

### 7. Get Categories

- Method: GET
- Route: `/api/categories`
- Description: Get category tree structure
- Response: Returns nested category structure

## Sales Management

### 8. Create Sale

- Method: POST
- Route: `/api/sales`
- Description: Record a new sale
- Request Body:

```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "price": "number"
    }
  ]
}
```

- Response: Returns created sale with total calculated

### 9. Get Sale History

- Method: GET
- Route: `/api/sales`
- Query Parameters: `?startDate=date&endDate=date&page=1&limit=10`
- Description: Get sales history with date range
- Response: Returns paginated sales list

## Purchase Management

### 10. Create Purchase

- Method: POST
- Route: `/api/purchases`
- Description: Record new stock purchase
- Request Body:

```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "price": "number"
    }
  ]
}
```

- Response: Returns created purchase with total calculated

### 11. Get Purchase History

- Method: GET
- Route: `/api/purchases`
- Query Parameters: `?startDate=date&endDate=date&page=1&limit=10`
- Description: Get purchase history with date range
- Response: Returns paginated purchases list

## Analytics Routes

### 12. Daily Sales Report

- Method: GET
- Route: `/api/analytics`
- Query Parameters: `?date=YYYY-MM-DD`
- Query Parameters: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Query Parameters: `?year=YYYY&month=MM`

## Search Routes

### 13. Search Products

- Method: GET
- Route: `/api/search/products`
- Query Parameters: `?q=searchTerm&category=categoryId?&minPrice=number?&maxPrice=number?`
- Description: Advanced product search
- Response: Returns matching products

## Common Routes

### 14. Dashboard Summary

- Method: GET
- Route: `/api/dashboard/summary`
- Description: Get overview of key metrics
- Response: Returns summary of sales, purchases, stock, and profit
