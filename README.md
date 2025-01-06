# Blog Platform - Microservices Architecture

A scalable blog platform built with Node.js microservices, Docker containers, and PostgreSQL database. The platform supports user authentication, blog post management, and commenting functionality.

## 🚀 Features

### User Service
- User authentication with JWT
- Secure password hashing with bcrypt
- User profile management
- Protected routes

### Blog Service
- Create, read, update, and delete blog posts
- Pagination support for scalability
- User-specific blog management
- Protected routes with JWT authentication

### Comment Service
- Add comments to blog posts
- View comments for specific posts
- Flat structure with future nested comments support
- Protected routes with JWT authentication

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose
- **Cloud Platform**: AWS (EC2 & RDS)
- **Other Tools**: bcrypt, cors, helmet

## 🏗️ Architecture
- **user-service**: Handles user authentication and management
- **blog-service**: Manages blog posts
- **comment-service**: Handles blog comments
- **database-service**: PostgreSQL database configurations

# 📋 Prerequisites

- Node.js (v14 or higher)
- Docker & Docker Compose
- PostgreSQL
- Git

## 🚀 Getting Started

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
```

2. Edit environment file:
- Enter your database password in place of YOUR_LOCAL_DB_PASSWORD
- Enter your database username in place of YOUR_LOCAL_DB_USER_NAME
- Enter your JWT Secret in place of YOUR_LOCAL_JWT_SECRET

3. Build and start services:
```
docker-compose up -d --build
```

4. Verify services are running:
```
docker-compose ps
```

## Deployment

### AWS Deployment

1. EC2 Setup

- Launch EC2 instance
- Configure security groups
- Install Docker & Docker Compose

2. RDS Setup:
- Create PostgreSQL instance
- Configure security groups
- Update environment variables

3. Connect with EC2 Instance
   ```
   ssh -i your_key.pem ubuntu@your-ec2-ip
   ```
   
4. Update System
   ```
   sudo apt update
   sudo apt upgrade -y
   ```
   
5. Clone the git Respository
   ```
   https://github.com/vishal8113/blog-platform-backend
   ```

6. Do Required Changes in .env.production file
    ```
    nano .env
    ```   
   
7. Install PostgreSQL client
   ```
   sudo apt install postgresql-client
   ```

8. Install Docker
   ```
   sudo apt install docker.io -y
   ```
   
9. Install Docker Compose
   ```
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```
   
10. Add ubuntu user to docker group
   ```
   sudo usermod -aG docker ubuntu
   newgrp docker
   ```
   
11. Connect to RDS (replace with your endpoint)
    ```
    psql -h your-rds-endpoint -U postgres
    ```

12. Create Database and their Schemas
    ```
    CREATE DATABASE blog_db;
    CREATE DATABASE comment_db;
    \l
    ```    

13. Run the container
```
docker-compose up -d --build
```

## 🌐 Live Demo
### User Service
Base URL: http://3.108.124.90:3000

### Blog Service
Base URL: http://3.108.124.90:3001

### Comment Service
Base URL: http://3.108.124.90:3002


## API Endpoints

### User Service (Authentication & User Management)

#### 1. Register User
```http
POST /api/register
```

Request Body:
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

Response:
```
{
    "id": "number",
    "username": "string",
    "email": "string"
}
```

#### 2. Login User
```http
POST /api/login
```

Request Body:
```json
{
    "username": "string",
    "password": "string"
}
```

Response:
```
{
    "token": "string",
    "user": {
        "id": "number",
        "username": "string",
        "email": "string"
    }
}
```

#### 3. Get User Details
```http
GET /api/users/:id
```

```Headers
Authorization: Bearer <token>
```

Response:
```
{
    "id": "number",
    "username": "string",
    "email": "string"
}
```

### Blog Service (Blog Management)
#### 1. Create Blog Post
```HTTP
POST /api/blogs
```
```Headers:
Authorization: Bearer <token>
```
Request Body:
```JSON
{
    "title": "string",
    "content": "string"
}
```
Response:
```JSON
{
    "id": "number",
    "title": "string",
    "content": "string",
    "user_id": "number",
    "created_at": "timestamp"
}
```
#### 2. Get All Blogs (with Pagination)
```HTTP
GET /api/blogs?page=1&limit=10
```
```Headers:
Authorization: Bearer <token>
```
Response:
```JSON
{
    "blogs": [
        {
            "id": "number",
            "title": "string",
            "content": "string",
            "user_id": "number",
            "created_at": "timestamp"
        }
    ],
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
}
```

### Comment Service (Comment Management)
#### 1. Add Comment
```HTTP
POST /api/comments
```
```Headers:
Authorization: Bearer <token>
```
Request Body:
```
JSON

{
    "content": "string",
    "post_id": "number"
}
```
Response:
```
JSON

{
    "id": "number",
    "content": "string",
    "user_id": "number",
    "blog_id": "number",
    "created_at": "timestamp"
}
```
#### 2. Get Comments for Post
```HTTP
GET /api/comments?post_id=1
```
```Headers:
Authorization: Bearer <token>
```
Response:
```JSON
[
    {
        "id": "number",
        "content": "string",
        "user_id": "number",
        "blog_id": "number",
        "created_at": "timestamp"
    }
]
```


## Design Decisions and Trade-offs
### 1. Microservices Architecture
**Decision:** Split the application into three separate services (User, Blog, Comment)

- Independent scaling
- Technology flexibility
- Isolated failures
- Easier maintenance

**Trade-offs:**

- Increased complexity
- Network overhead
- More complex deployment
- Data consistency challenges

### 2. Database Design
**Decision:** Separate databases for each service

- Data isolation
- Independent scaling
- Service autonomy

**Trade-offs:**

- Data duplication
- Cross-service queries complexity
- Eventual consistency
  
### 3. Authentication

**Decision:** JWT-based authentication

- Stateless authentication
- Scalable
- Cross-domain support
  
**Trade-offs:**

- Token size
- Can't invalidate tokens immediately
- Token storage security
  
### 4. Comment Structure

**Decision:** Flat comment structure with future nested capability

- Simpler initial implementation
- Better performance for basic use cases
- Easier to maintain
  
**Trade-offs:**

- Limited functionality initially
- Future migration complexity
- No immediate support for threaded discussions
### 5. Pagination

**Decision:** Cursor-based pagination for blogs and comments

- Consistent results with real-time updates
- Better performance with large datasets
- No skipped or duplicate items
  
**Trade-offs:**

- More complex implementation
- Less intuitive for front-end developers
- No "jump to page" functionality
- Security Considerations

### Password Security:

- Bcrypt hashing
- Salt rounds configuration
- Password strength validation
### API Security:

- JWT token expiration
- CORS configuration
- Rate limiting
- Helmet security headers
### Database Security:

- Prepared statements
- Input validation
- Limited database user permissions

### Future Improvements
#### Caching Layer:

- Redis integration
- Cache invalidation strategy
#### Monitoring:

- Logging system
- Performance metrics
- Error tracking
#### Scalability:

- Load balancing
- Service discovery
- Message queues for async operations


## 🛡️ Security Features
- JWT Authentication
- Password Hashing
- Request Rate Limiting
- Security Headers (Helmet)
- Database Query Protection

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 👥 Authors
Vishal Chauhan

## 📞 Support
For support, email vishalch822@gmail.com or create an issue in the repository.
