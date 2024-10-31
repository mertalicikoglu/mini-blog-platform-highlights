### `snippets/useAuth.ts`
This snippet showcases the authentication flow using Supabase for the mini-blog platform. It includes:
- **User Sign Up**: Allows new users to register with an email and password.
- **User Sign In**: Users can log in with their email and password.
- **User Sign Out**: Users can sign out from their account.
- **Session Management**: The `useEffect` hook ensures that the user session is maintained and updated based on authentication state changes.


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
