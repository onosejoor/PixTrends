# 🌟 PixTrends: Discover & Share Visual Trends! 📸🎨

PixTrends is a vibrant platform built with Next.js for sharing and discovering the latest trends in photography, art, and design. Join a community of creatives and explore stunning visuals!

## 🚀 Installation

Get PixTrends up and running locally with these simple steps:

- ⬇️ **Clone the Repository**:
  ```bash
  git clone https://github.com/onosejoor/PixTrends.git
  cd PixTrends
  ```

- ⚙️ **Install Dependencies**:
  ```bash
  npm install
  # or
  yarn install
  # or
  pnpm install
  ```

- 🔑 **Set up Environment Variables**:
  - Create a `.env.local` file in the root directory.
  - Add the following environment variables (refer to `env.example`):
    ```
    SESSION_SECRET=""
    EMAIL_USER=""
    APP_PASSWORD=""
    MONGODB_URL=""
    GOOGLE_CODE=""
    CLOUDINARY_SECRET=""
    CLOUDINARY_APIKEY=""
    CLOUDINARY_PRESET=""
    CLOUDINARY_CLOUD_NAME=""
    SERVER_URL=""
    SSE_URL=""
    AUTH_GOOGLE_ID=""
    AUTH_GOOGLE_SECRET=""
    AUTH_SECRET=""
    ```

- 🏃‍♂️ **Run the Development Server**:
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 💡 Usage

Explore PixTrends and engage with the community! Here are some examples:

<details>
<summary><b>Creating a Post</b></summary>
<br>
   1. Navigate to the `/create` route to access the post creation form.
   2. Enter your content and upload any images you want to include.
   3. Click the "Post" button to share your masterpiece with the world!

```tsx
// Example of a Create Post Component
import CreatePostForm from './_components/Form';

export default async function CreatePostPage() {
  return <CreatePostForm />;
}
```
</details>

<details>
<summary><b>Exploring Trending Content</b></summary>
<br>
   1. Visit the `/trending` route to discover popular posts and users.
   2. Use the search bar to find specific trends or users.
   3. Engage with the community by liking and commenting on posts.

```tsx
// Example of using SearchBar Component
import { SearchBar } from "./_components/SearchBar";
function TrendingPage() {
  return (
    <div className="grid gap-5 py-10">
      <SearchBar />
    </div>
  );
}
```
</details>

## ✨ Features

- ✅ **User Authentication**: Secure sign-up and sign-in using NextAuth.js.
- ✍️ **Post Creation**: Create and share captivating visual content.
- 🚀 **Trending Discovery**: Explore the latest trends in photography, art, and design.
- 🔔 **Real-time Notifications**: Stay updated with real-time notifications via Server-Sent Events (SSE).
- 👤 **User Profiles**: Customize your profile and showcase your creativity.
- 💬 **Commenting System**: Engage in discussions with other users.
- ❤️ **Liking**: Show appreciation for content you love.
- 🔎 **Search**: Find content and users easily.
- ⚙️ **Settings**: Customize your account settings.

## 🛠️ Technologies Used

| Technology         | Link                                       |
| ------------------ | ------------------------------------------ |
| Next.js            | [https://nextjs.org/](https://nextjs.org/) |
| TypeScript         | [https://www.typescriptlang.org/](https://www.typescriptlang.org/)             |
| Tailwind CSS       | [https://tailwindcss.com/](https://tailwindcss.com/)           |
| MongoDB            | [https://www.mongodb.com/](https://www.mongodb.com/)             |
| NextAuth.js        | [https://next-auth.js.org/](https://next-auth.js.org/)              |
| Mongoose | [https://mongoosejs.com/](https://mongoosejs.com/) |
| Cloudinary | [https://cloudinary.com/](https://cloudinary.com/)             |
| SWR | [https://swr.vercel.app/](https://swr.vercel.app/) |

## 🤝 Contributing

We welcome contributions from the community! Here are the guidelines:

- 🐛 **Report Bugs**: Submit detailed bug reports.
- 🛠️ **Suggest Enhancements**: Share your ideas for new features.
- 🧑‍💻 **Submit Pull Requests**: Contribute code improvements.

Please ensure your code adheres to the project's style guidelines.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author Info

- Author: [Onos Ejoor]("https://onos-ejoor.vercel.app")