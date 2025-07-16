# Supermarket Web Application

A comprehensive full-stack e-commerce web application for supermarket management, developed as a semester project for Database Systems course. This project demonstrates modern web development practices with a focus on database design, user experience, and scalable architecture.

## 🎯 Project Overview

This application serves as a complete supermarket management system with multiple user roles and comprehensive functionality for product management, order processing, and administrative operations. The project was developed by a 2-person team over one semester.

## 👥 Team & My Contributions

**My Role:** UI/UX Designer, Front-end Developer, Database Developer

**Teammate's Role:** Backend Developer, Database Procedures & Functions

### My Key Contributions:

#### 🎨 UI/UX Design & Frontend Development
- **Modern React Architecture**: Designed and implemented a scalable React application with component-based architecture
- **Material-UI Integration**: Created a cohesive design system using Material-UI components with custom styling
- **Responsive Design**: Developed mobile-first responsive layouts ensuring optimal user experience across devices
- **Role-Based Navigation**: Implemented dynamic navigation systems for different user roles (Public, User, Employee, Admin)
- **Authentication Flow**: Designed intuitive login/registration forms with real-time validation and error handling
- **State Management**: Implemented React Context for authentication and shopping cart state management
- **Modern CSS**: Used styled-components and Material-UI's styling system for consistent theming

#### 🏗️ Database Design & Development
- **Comprehensive Schema Design**: Architected a normalized database schema supporting complex business relationships
- **Oracle Database Integration**: Designed database structure optimized for Oracle database system
- **Entity Relationships**: Modeled complex relationships between entities (Users, Products, Orders, Payments, Warehouses)
- **Data Integrity**: Implemented constraints and relationships ensuring data consistency
- **Performance Optimization**: Designed efficient table structures and indexing strategies

#### 🔧 Frontend Architecture & Features
- **Multi-Role Interface**: Developed distinct interfaces for different user types with appropriate permissions
- **Product Catalog**: Created sophisticated product listing with search, filtering, and pagination
- **Shopping Cart**: Implemented persistent shopping cart functionality with local storage integration
- **Admin Dashboard**: Built comprehensive admin panels for managing all system entities
- **Order Management**: Developed interfaces for order tracking and management
- **User Experience**: Focused on intuitive workflows and seamless user interactions

## 🛠️ Technology Stack

### Frontend Technologies (My Focus)
- **React 18** - Modern functional components with hooks
- **Material-UI (MUI)** - Comprehensive UI component library
- **React Router DOM** - Client-side routing and navigation
- **Styled Components** - CSS-in-JS styling solution
- **React Icons** - Consistent iconography
- **Axios** - HTTP client for API communication
- **JWT Decode** - Token management for authentication
- **Day.js** - Date manipulation and formatting

### Backend Technologies
- **Spring Boot 3.3.5** - Java-based REST API framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **Oracle Database** - Enterprise-grade database system
- **JWT** - JSON Web Token authentication
- **Maven** - Dependency management

### Database Architecture
- **Oracle Database** - Primary data store
- **Stored Procedures** - Business logic implementation
- **Complex Relationships** - Multi-table joins and foreign keys
- **Transaction Management** - ACID compliance and data integrity

## 🎯 Key Features

### 🛍️ E-Commerce Functionality
- **Product Catalog**: Browse products with advanced search and filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Order Processing**: Complete order workflow with payment integration
- **User Accounts**: Registration, login, and profile management

### 👤 Multi-Role System
- **Public Users**: Browse products and create accounts
- **Customers**: Full shopping experience with order history
- **Employees**: Order management and inventory oversight
- **Administrators**: Complete system management capabilities

### 📊 Administrative Features
- **Product Management**: CRUD operations for products, categories, and inventory
- **Order Management**: Process and track customer orders
- **User Management**: Manage customer and employee accounts
- **Warehouse Management**: Inventory and supplier relationships
- **Payment Processing**: Handle various payment methods
- **Reporting**: System logs and analytics

## 🏗️ Architecture Decisions

### Frontend Architecture Rationale
- **React with Functional Components**: Chosen for modern development practices and better performance
- **Material-UI**: Selected for rapid development and consistent design language
- **Context API**: Used for state management to avoid prop drilling
- **Role-Based Routing**: Implemented to ensure proper access control
- **Component-Based Design**: Promotes reusability and maintainability

### Database Design Philosophy
- **Normalized Structure**: Ensures data integrity and reduces redundancy
- **Oracle Database**: Chosen for enterprise-level reliability and performance
- **Stored Procedures**: Implemented for complex business logic and security
- **Comprehensive Relationships**: Modeled real-world business scenarios

### UI/UX Design Principles
- **User-Centered Design**: Focused on intuitive user flows
- **Accessibility**: Ensured proper contrast ratios and keyboard navigation
- **Responsive Design**: Mobile-first approach for universal accessibility
- **Consistent Branding**: Unified color scheme and typography

## 🗃️ Database Schema

The database includes comprehensive entities modeling a real supermarket ecosystem:

- **Users & Authentication**: User accounts with role-based permissions
- **Products & Categories**: Product catalog with hierarchical categorization
- **Inventory Management**: Warehouse and stock tracking
- **Order Processing**: Complete order lifecycle management
- **Payment Systems**: Multiple payment method support
- **Administrative Data**: Logging, reporting, and system management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Java 21
- Oracle Database
- Maven

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aaarono/SupermarketWebApp.git
cd SupermarketWebApp
```

2. **Frontend Setup**
```bash
cd react-frontend
npm install
npm start
```

3. **Backend Setup**
```bash
cd backend
mvn spring-boot:run
```

4. **Database Configuration**
Update `application.properties` with your Oracle database credentials.

## 📱 User Interface Showcase

### Design Highlights
- **Modern Gradient Design**: Eye-catching gradients throughout the application
- **Intuitive Navigation**: Role-specific navigation menus
- **Responsive Layout**: Seamless experience across devices
- **Interactive Elements**: Hover effects and smooth transitions
- **Consistent Typography**: Material-UI typography scale
- **Accessible Design**: WCAG compliance considerations

### Key UI Components
- Dynamic product cards with image support
- Sophisticated data tables with sorting and pagination
- Modal dialogs for form interactions
- Snackbar notifications for user feedback
- Loading states and error handling
- Professional admin dashboard layouts

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure password handling

## 📈 Performance Optimizations

- Component memoization for React performance
- Lazy loading for large datasets
- Optimized database queries
- Efficient state management
- Image optimization and caching

## 🎓 Learning Outcomes

This project enhanced my skills in:
- **Modern React Development**: Hooks, Context, and functional components
- **UI/UX Design**: User-centered design principles and accessibility
- **Database Design**: Normalization, relationships, and optimization
- **Full-Stack Integration**: Frontend-backend communication patterns
- **Enterprise Patterns**: Scalable architecture and best practices

## 🔮 Future Enhancements

- Real-time notifications using WebSockets
- Advanced analytics dashboard
- Mobile application development
- Microservices architecture migration
- Advanced search with Elasticsearch
- Payment gateway integration
- Internationalization support

## 📝 Technical Challenges Solved

1. **Complex State Management**: Implemented efficient context-based state management
2. **Role-Based UI**: Created dynamic interfaces adapting to user permissions
3. **Database Optimization**: Designed efficient queries for complex relationships
4. **Responsive Design**: Ensured consistent experience across device sizes
5. **Authentication Flow**: Implemented secure JWT-based authentication

## 🤝 Collaboration

This project demonstrates effective team collaboration with clear role separation while maintaining code quality and consistency. The modular architecture allowed parallel development of frontend and backend components.

---

**Note**: This project was developed as part of university coursework to demonstrate practical application of database systems concepts, modern web development practices, and user experience design principles.
