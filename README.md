# **📸✨ PixTrends: Discover & Share Visual Inspiration! ✨🎨**

Hey there! 👋 Welcome to PixTrends, a vibrant community where you can explore, share, and stay updated on the latest trends in photography, art, and design. Whether you're an artist, designer, or just someone who loves beautiful visuals, PixTrends is your go-to platform for daily inspiration. 🌟

## 🚀 Installation

Get PixTrends up and running locally with these simple steps:

- ⬇️ **Clone the Repository**:

  ```bash
  git clone https://github.com/onosejoor/PixTrends.git
  cd PixTrends
  ```

- 📦 **Install Dependencies**:

  ```bash
  npm install # Or yarn install, or pnpm install
  ```

- ⚙️ **Set Up Environment Variables**:

  - Create a `.env.local` file in the root directory.
  - Add your environment variables based on the `.env.example` file. Make sure to fill in the necessary keys like MongoDB URI, Cloudinary credentials, etc.

  ```example
  SESSION_SECRET="your_secret_key"
  MONGODB_URI="mongodb://localhost:27017/pixtrends"
  CLOUDINARY_APIKEY="your_cloudinary_api_key"
  CLOUDINARY_SECRET="your_cloudinary_api_secret"
  CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
  ```

- 🏃 **Run the Development Server**:
  ```bash
  npm run dev # Or yarn dev, or pnpm dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 🛠️ Usage

PixTrends is designed to be intuitive and engaging. Here’s how to make the most of it:

<details>
<summary><b>Creating an Account</b></summary>
<br>
1.  **Navigate to the Sign-Up Page**: Click on the "Sign Up" link in the navigation bar.
2.  **Fill in the Required Information**: Provide your name, email, username, and password.
3.  **Verify Your Email**: Enter the OTP (One-Time Password) sent to your email address.
4.  **Start Exploring**: Once your account is verified, you can start exploring the latest trends!

```jsx
// Example: Sign-up form component
<SignUpForm />
```

</details>

<details>
<summary><b>Posting Visuals</b></summary>
<br>
1.  **Go to the Create Page**: Click on the "+" icon in the navigation bar.
2.  **Add Content**: Enter a description and upload your image(s).
3.  **Post**: Click the "Post" button to share your visual with the community.

![Create Post](https://i.imgur.com/your_image_url.png)

</details>

<details>
<summary><b>Exploring Trends</b></summary>
<br>
1.  **Navigate to the Trending Page**: Click on the "Trending" link in the navigation bar.
2.  **Discover**: Browse the latest trending posts and users.
3.  **Search**: Use the search bar to find specific content or users.

```jsx
// Example: Trending page component
<TrendingPosts />
```

</details>

## ✨ Key Features

- 🖼️ **Image Sharing**: Upload and share your stunning photos, artworks, and designs.
- 👤 **User Profiles**: Create and customize your profile to showcase your unique style.
- 🔎 **Trend Discovery**: Stay up-to-date with the latest visual trends in the community.
- 🔔 **Notifications**: Get real-time updates on likes, comments, and follows.
- 💬 **Comments**: Share your thoughts and feedback on posts.
- ❤️ **Likes**: Show appreciation for your favorite visuals.

## 💻 Technologies Used

| Technology   | Description                                          | Link                                                               |
| :----------- | :--------------------------------------------------- | :----------------------------------------------------------------- |
| Next.js      | React framework for building web applications        | [https://nextjs.org/](https://nextjs.org/)                         |
| TypeScript   | Superset of JavaScript which adds static typing.     | [https://www.typescriptlang.org/](https://www.typescriptlang.org/) |
| Tailwind CSS | Utility-first CSS framework for rapid UI development | [https://tailwindcss.com/](https://tailwindcss.com/)               |
| MongoDB      | NoSQL database for storing application data          | [https://www.mongodb.com/](https://www.mongodb.com/)               |
| NextAuth.js  | Authentication library for Next.js                   | [https://next-auth.js.org/](https://next-auth.js.org/)             |
| Cloudinary   | Cloud-based image management service                 | [https://cloudinary.com/](https://cloudinary.com/)                 |
| Ioredis      | A robust Redis client for Node.js                    | [https://github.com/luin/ioredis](https://github.com/luin/ioredis) |
| Lucide React | Beautifully simple, pixel-perfect icons for React    | [https://lucide.dev/](https://lucide.dev/)                         |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

- 🐛 **Report Bugs**: Submit detailed bug reports to help us squash those pesky issues.
- 💡 **Suggest Features**: Share your ideas for new features and improvements.
- 🛠️ **Submit Pull Requests**: Contribute code changes to fix bugs or add new features.

To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests.
4.  Submit a pull request with a clear description of your changes.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🧑‍💻 Author Info

- **Onos Ejoor**
  - [Github](https://github.com/onosejoor)
  - [Twitter](https://twitter.com/DevText16)
  - [PixTrends](https://www.pixtrends.vercel.app/DevText16)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
