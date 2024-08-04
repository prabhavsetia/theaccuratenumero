# TheAccurateNumero 

Welcome to TheAccurateNumero, an astronomy website where you can explore the wonders of the universe through blogs, learn about our services, and get in touch with us. This website also includes an admin panel for managing blog content.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Pages](#pages)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Home Page**: Introduction to the website and highlights of recent blog posts.
- **About Me Page**: Information about the website creator.
- **Blog Page**: List of blog posts with summaries and links to full posts.
- **Blog Post Detail Page**: Full content of individual blog posts.
- **Services Page**: Detailed descriptions and prices of services offered.
- **Contact Page**: Form to collect user information and messages.
- **Admin Login Page**: Secure login for admin to manage the site.
- **Admin Dashboard**: Admin panel to add, edit, delete blog posts, and view contact messages.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/stellarinsights.git
    cd stellarinsights
    ```

2. Install frontend dependencies:
    ```bash
    cd client
    npm install
    ```

3. Install backend dependencies:
    ```bash
    cd ../server
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in the `server` directory.
    - Add the following environment variables:
      ```
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```

5. Start the development server:
    - Run the backend server:
      ```bash
      cd server
      npm start
      ```
    - Run the frontend development server:
      ```bash
      cd ../client
      npm start
      ```

## Usage

1. Visit `http://localhost:3000` in your web browser to view the website.
2. Use the admin login to access the admin dashboard for managing blog posts and contact messages.

## Pages

- **Home**: Overview of the website.
- **About Me**: Information about the creator.
- **Blog**: List of blog posts.
- **Blog Post Detail**: Detailed view of a single blog post.
- **Services**: Information on services offered.
- **Contact**: Form to contact the creator.
- **Admin Login**: Admin authentication page.
- **Admin Dashboard**: Admin panel to manage content.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
