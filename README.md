This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Frontend Application

This is the frontend part of the application, built with **Next.js** and **React**. It uses **Material-UI** for UI components and supports drag-and-drop functionality via **React DnD**.

## **Technologies Used**

### **Core Frameworks**
- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- [React](https://reactjs.org/) - Library for building user interfaces.

### **UI and Styling**
- [MUI (Material-UI)](https://mui.com/) - Component library based on Material Design.
  - [@mui/material](https://mui.com/material-ui/getting-started/overview/) - Core Material-UI components.
  - [@mui/icons-material](https://mui.com/material-ui/material-icons/) - Material Design icons.
  - [@emotion/react](https://emotion.sh/docs/introduction) - CSS-in-JS library.
  - [@emotion/styled](https://emotion.sh/docs/styled) - Styled components.

### **API Integration**
- [Axios](https://axios-http.com/) - Promise-based HTTP client for making API requests.

### **Drag-and-Drop**
- [React DnD](https://react-dnd.github.io/react-dnd/about) - API for drag-and-drop functionality.
- [React DnD HTML5 Backend](https://react-dnd.github.io/react-dnd/docs/backends/html5) - HTML5 backend for drag-and-drop.

### **Additional Libraries**
- [React Content Loader](https://github.com/danilowoz/react-content-loader) - Skeleton loaders for better user experience.

### **Routing**
- [React Router DOM](https://reactrouter.com/) - Library for routing in React applications.

### **Development Tools**
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [ESLint](https://eslint.org/) - JavaScript/TypeScript linter.
- [ESLint Config for Next.js](https://nextjs.org/docs/basic-features/eslint) - Preconfigured ESLint rules for Next.js.

## **Setup and Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/app_front.git
   cd app_front
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Build for production:
    ```bash
    npm run build
    ```

5. Start the production server:
    ```bash
    npm start
    ```
