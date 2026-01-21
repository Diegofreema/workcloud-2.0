## Goal
Create a new email template `convex/email/newOrganisationCreated.tsx` that notifies a user about a newly created organization, displaying its name, image, description, and address, following the style of the existing `newOrganizationEmail.tsx`.

## Implementation Steps
1.  **Create File**: Create `convex/email/newOrganisationCreated.tsx`.
2.  **Define Props**: Define the component props to include `orgName`, `imageUrl`, `description`, and `address`.
3.  **Implement UI**:
    *   Copy the structure and styles from `convex/email/newOrganizationEmail.tsx`.
    *   Update the Heading to "New Organization Created".
    *   Replace the main content to display the organization details:
        *   **Image**: Use the `<Img />` component to display `imageUrl`.
        *   **Name**: Display `orgName` prominently.
        *   **Description**: Display `description`.
        *   **Address**: Display `address`.
    *   Keep the footer and general layout consistent with the existing template.

## File to Create
- [newOrganisationCreated.tsx](file:///Users/mac/Desktop/personal/workcloud-2.0/convex/email/newOrganisationCreated.tsx)

## Dependencies
- `@react-email/components` (already in use)

I will proceed to create the file with the specified content.