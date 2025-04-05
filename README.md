# MERN Project

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application.

![generated_image_1](https://github.com/user-attachments/assets/192facaf-8e52-44a5-87a6-aa0fc5ccf866)
![generated_image_2](https://github.com/user-attachments/assets/99aee7ad-1b3b-4d3d-9354-2f386b7ff36a)
![chat_generation](https://github.com/user-attachments/assets/62fb3d2a-28de-4e44-8faf-a91108baf24f)




## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (for database visualization)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/mern-project.git
   cd mern-project
   ```

2. Install server dependencies:
   ```sh
   npm install
   ```

3. Install client dependencies (if applicable):
   ```sh
   cd client
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add:
   ```env
   # API KEY FOR IMAGE GENERATION
   HF_TOKEN=ADD_YOUR_HUGGINGFACE_API_HERE
   # Enter your secert key here
   JWT_SECRET=Secert_Key
   MONGO_URI=mongodb://localhost:27017/yourdbname
   PORT=5000
   ```

2. Make sure MongoDB is running locally or update the `MONGO_URI` to your Atlas connection string.

## Running the Project

### Start the Backend
```sh
npm start
```

### Start the Frontend (if applicable)
```sh
cd client
npm start
```

## Important Notes

- **Don't forget to connect with MongoDB Compass** to visualize the database.
- Ensure MongoDB is running before starting the backend server.


