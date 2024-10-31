### Frontend Highlights

### `snippets/useAuth.ts`
This snippet demonstrates the user authentication flow of the mini-blog platform using Supabase, including:
- **Sign-Up, Sign-In, and Sign-Out**: Allows users to create an account, log in, and log out.
- **Session Management**: Tracks the user's session and automatically updates the context when the session changes.

### `snippets/CreatePost.tsx`
This snippet showcases the post creation functionality for the mini-blog platform. It includes:
- **Post Title and Content**: Users can provide a title and content for their post.
- **Form Validation**: Utilizes Zod schema to validate the title and content fields.
- **React Query**: Manages the `createPost` mutation for adding new posts.
- **User Feedback**: Provides feedback on successful or failed post creation.

### `snippets/Comments.tsx`
This snippet showcases the comments management functionality of the mini-blog platform, including:
- **Add, Edit, and Delete Comments**: Allows users to add new comments, edit their own comments, and delete them.
- **User Authorization**: Users can only edit or delete their own comments.
- **Real-Time Updates**: Uses Supabase subscriptions to update comments in real-time.

### `snippets/postModel.ts`
This snippet demonstrates the backend interactions with Supabase for managing posts, including:
- **Create, Read, Update, and Delete** operations for blog posts.
- **Pagination** and **search** functionality to efficiently fetch posts.

### `snippets/postController.ts`
This snippet defines the controller functions used to manage posts in the backend:
- **HTTP Request Handlers** for getting posts, creating, updating, and deleting posts.
- Ensures proper data validation before creating or updating a post.


### Backend Highlights

#### `snippets/app.ts`
This snippet shows the setup of the Express server:
- **CORS** and **JSON parsing** middlewares.
- Configures **routes for posts and comments**.
- Integrates the global **error handler**.

#### `snippets/authMiddleware.ts`
This snippet contains the middleware used for authenticating requests:
- Verifies if the user is logged in by checking the **Bearer token**.
- Attaches user information to the request object if authenticated.

#### `snippets/initializeDatabase.ts`
This snippet is responsible for initializing the database:
- **Creates tables** for posts and comments if they don't exist.
- Uses Supabase's `rpc` functions to **execute SQL procedures** for table creation.

#### `snippets/errorHandler.ts`
Provides consistent error handling:
- Ensures that any errors thrown in the backend are **logged** and returned with a structured JSON response.
