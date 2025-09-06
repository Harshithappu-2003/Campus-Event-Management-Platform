# 🎓 Campus Event Management Platform

## 📌 Project Overview
Hey there! 👋 This project is my take on a **Campus Event Management Platform**, designed as a full-stack solution.  
The goal was to build a system that could handle the **entire lifecycle of an event**, from a student registering to a college admin analyzing reports.

- The **back-end** is a RESTful API that handles all the heavy lifting, like managing data and performing calculations.  
- The **front-end** is a clean, responsive web interface that makes it easy for a student to register and for an admin to view key event metrics.  

My main focus was on creating a **functional, end-to-end solution** that is both reliable and easy to use.

### OUTPUT SCREENSHOTS
<img width="1915" height="1023" alt="Frontend-Main-View png" src="https://github.com/user-attachments/assets/bf3018c7-8778-4444-9b53-1bc610139549" />
<img width="3145" height="769" alt="Flow Diagram" src="https://github.com/user-attachments/assets/8a047747-bfb9-4f33-a579-7375da51504a" />
<img width="1918" height="1079" alt="My_SQL_Workbench" src="https://github.com/user-attachments/assets/e85b459a-73ce-47da-8c9b-7e40275b9e5c" />

<img width="1911" height="1077" alt="Postman-Attendance-Report png" src="https://github.com/user-attachments/assets/4233ee10-d6ff-4805-a682-95c50f606b17" />
<img width="1904" height="1079" alt="Postman-Feedback-Report png" src="https://github.com/user-attachments/assets/06e541ab-b4f3-4a0a-8d51-d2ff61442b0a" />
<img width="1912" height="1079" alt="Postman-Top-Students png" src="https://github.com/user-attachments/assets/e1526a60-9e61-49a9-b523-9bb79e82e122" />
<img width="697" height="1078" alt="Total_api_calls" src="https://github.com/user-attachments/assets/57550431-0c9b-4928-b7ba-1b845b93e0d2" />

---

## 🧩 My Personal Understanding
For me, the assignment was all about **connecting the dots in a full-stack application**.  
It wasn’t just about writing code for a front-end or a back-end in isolation, but about making them **work together seamlessly**.

The biggest challenge was ensuring that the **data flowed correctly**:
- From the **UI**,  
- Through the **API**,  
- Into the **database**,  
- And back again for **reporting**.

I chose to use a **relational database** because the data for events, students, and registrations has a clear, well-defined relationship.  
This approach made it much easier to **ensure data integrity** and **build complex reports**.

Using a simple **React front-end** allowed me to create a **user-friendly interface** that clearly showcases all the different functionalities of the system.

---

## ⚙️ Technology Stack
This project was built using a **classic and powerful technology stack**:

- **Backend**: Node.js with Express  
- **Database**: MySQL  
- **Frontend**: React.js  
- **API Client**: Axios for making HTTP requests  
- **Styling**: Custom CSS  

---

## 🚀 Installation and How to Run
To get this project up and running on your local machine, just follow these simple steps.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Harshithappu-2003/Campus-Event-Management-Platform.git
cd Campus-Event-Management-Platform

2️⃣ Set Up the Database
You'll need a MySQL server running locally.
Create a new database named campus_events and then run the following SQL commands:
CREATE DATABASE campus_events;
USE campus_events;

-- Insert your table creation and dummy data SQL here.
3️⃣ Install Dependencies

The project has two separate parts (backend and frontend), each with its own dependencies.

For the Backend:

npm install


For the Frontend:

cd campus-events-ui
npm install

4️⃣ Run the Application

You'll need two separate terminal windows.

In the first one, start the backend:

cd campus-events-api
npm start


In the second one, start the frontend:

cd campus-events-ui
npm start


The backend will run on http://localhost:3000,
and the frontend will open automatically in your browser.



📌 Event Popularity Report

This report, visible on the main UI, ranks events based on the number of student registrations.

📌 Attendance Percentage Report

This report, accessed via a GET request to:

/api/reports/attendance/:event_id


Shows the attendance rate for a specific event.

📌 Top Students Report

A bonus feature!
This report ranks the top three students who have attended the most events.

📌 Average Feedback Score

This report gives the average feedback rating for a particular event.









