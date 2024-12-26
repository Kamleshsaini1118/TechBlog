# TechBlog
TechBlog is a modern, fully-functional blog application designed for technology enthusiasts to share, discover, and engage with insightful content. Built using the MERN stack, this platform provides a seamless and interactive experience for users.

---

## **Features**

### **User Authentication**
- Secure signup and login system using JWT authentication.
- Role-based access for admins and users.

### **Blog Management**
- Create, edit, and delete blog posts with a rich text editor.
- Add tags to organize posts by topics.

### **Dynamic Content Display**
- Responsive design for all devices.
- PostCard components displaying titles, images, tags, views, likes, and creation dates.

### **Interactive Post Details**
- Like and comment system with support for nested replies.
- View counter that tracks unique views per user.

### **User Engagement**
- Real-time updates for comments and likes.
- Notification system using toast messages for feedback.

---

## **Tech Stack**

### **Frontend**
- React
- Tailwind CSS
- React Router
- React Quill (Rich Text Editor)
- Axios

### **Backend**
- Node.js
- Express.js
- JWT Authentication
- Multer (for file uploads)

### **Database**
- MongoDB (NoSQL)
  
---

## **Installation and Setup**

### **Prerequisites**
Ensure you have the following installed:
- Node.js
- MongoDB
- npm or yarn

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TechBlog.git
   cd TechBlog/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd /Frontend/blog
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`.

---

## **Usage**

1. **Signup/Login**: Create an account or log in with your credentials.
2. **Create Posts**: Write, format, and publish posts using the rich text editor.
3. **View Posts**: Browse posts, leave comments, and engage with other users.

---
---

## **Contributing**

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---
---

## **Contact**

For questions or suggestions, feel free to reach out:
- **Email**: kamleshsaini1345@example.com
- **GitHub**: [Kamleshsaini1118](https://github.com/yourusername)

Happy Blogging! 🚀
