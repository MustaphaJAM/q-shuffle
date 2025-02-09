# Q-Shuffle

**Q-Shuffle** is a simple application designed for creating, managing, and shuffling customizable question sheets for exams. It empowers educators with an intuitive and flexible platform for designing assessments, distributing them to students, and automating grading.

## Features

- **User Roles**
  - Role-based access control with `admin` and `user` permissions.
- **Exam Management**

  - Create, update, and manage exams with configurable settings like duration, pass percentage, and navigation controls.
  - Publish exams and generate shareable public links.

- **Question Types(in progress)**

  - Multiple-choice questions (MCQ).
  - True/False questions.
  - Short answer questions.

- **Student Exam Sessions**

  - Track individual student attempts with start and end times.
  - Automatically calculate scores and completion status.
  - Save detailed answers and time spent per question.

- **Dynamic Question Shuffling(in progress)**

  - Ensure unique test versions by shuffling question orders dynamically.

- **Result Visibility**
  - Flexible configuration to show or hide results after exam completion.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following tools installed:

- **Node.js**: Install [Node.js](https://nodejs.org/) (ensure the latest LTS version).
- **MongoDB**: Set up a MongoDB cluster or install it locally. You can sign up for a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Step 1: Clone the repository

Clone this repository to your local machine:

```bash
git clone <repository_url>
cd q-shuffle
```

### Step 2: Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
APP_URL="http://localhost:3000"
SECRET="your_secret_key"
GOOGLE_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
FACEBOOK_CLIENT_ID="your_facebook_client_id"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"
EMAIL_USERNAME="your_email_username"
EMAIL_PASSWORD="your_email_password"
```

- **`SECRET`**: A secret key for your app’s encryption.
- **OAuth Credentials**: Get your credentials from Google and Facebook for authentication.
- **Cloudinary**: Set up an account on [Cloudinary](https://cloudinary.com/) for image management.
- **Email**: Configure your SMTP settings if you are using Nodemailer for email functionality.

### Step 4: Run the Development Server

Start the development server with:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/docs)
- **UI Framework:** [React](https://reactjs.org/docs/getting-started.html), [Tailwind CSS](https://tailwindcss.com/docs)
- **Database ORM:** [Prisma](https://www.prisma.io/docs/)
- **Database:** [MongoDB](https://docs.mongodb.com/)
- **Authentication:** [NextAuth](https://next-auth.js.org/)
- **Email Notifications:** [Nodemailer](https://nodemailer.com/)

## Built With

- **Next.js**: A React-based framework for building the frontend.
- **Tailwind CSS**: A utility-first CSS framework for custom UI styling.
- **Prisma**: An ORM for seamless interaction with MongoDB.
- **MongoDB**: NoSQL database for storing data.
- **NextAuth.js**: Authentication library for OAuth and session management.
- **Nodemailer**: A module for sending emails using SMTP.

## License

This project is licensed under the MIT License.

## Documentation

For further documentation and resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Nodemailer Documentation](https://nodemailer.com/)
