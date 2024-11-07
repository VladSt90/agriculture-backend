# Backend API for Image Processing

This repository contains the backend API for an image processing application. The backend is built using **Django** and **Django REST Framework** and leverages **Celery** for asynchronous task processing. The API integrates with a machine learning model for image object detection and processing.

---

## Features

- **User Authentication**: JWT-based authentication for secure API access.
- **Image Set Management**: Upload, list, and process image sets.
- **Asynchronous Processing**: Task queuing and execution using Celery and Redis.
- **Machine Learning Integration**: Object detection and data processing with the `smutuvi/flower_count_model`.
- **Nginx Proxying**: Serves static files and proxies API requests.

---

## Getting Started

### Prerequisites

- **Docker**: Ensure Docker is installed on your system.
- **Poetry**: For managing Python dependencies.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VladSt90/agriculture-backend.git
   cd agriculture-backend
   ```

2. **Build and run the services**:
   ```bash
   docker-compose up --build
   ```

3. **Apply database migrations**:
   ```bash
   docker-compose exec django_api python manage.py migrate
   ```

4. **Create a superuser**:
   ```bash
   docker-compose exec django_api python manage.py createsuperuser
   ```

---

## Usage

Check Swagger doc at /api/schema/swagger-ui/#/


## Contact

- **Author**: Vladislav Stukov  
- **GitHub**: [VladSt90](https://github.com/VladSt90)  
